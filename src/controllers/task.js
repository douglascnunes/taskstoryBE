import sequelize from '../util/db.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';

import Activity from '../models/activity/activity.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import { STATUS, ACTIVITY_TYPE, POINTS, INSTANCE_STATUS } from '../util/enum.js';
import { Op } from 'sequelize';
import { buildActivityUpdateData } from '../util/helpers/controller-activity.js';
import { buildTaskUpdateData, calculateStepCompletionPoints, isSettingPeriodOrFrequencyForFirstTime, sanitizeStepCompletionStatus } from '../util/helpers/controller-task.js';
import TaskInstance from '../models/task/taskInstance.js';
import { applyUserPoints } from '../util/helpers/controller-user.js';
import { calculateKeywordPoints, updateActivityKeywords } from '../util/helpers/controller-keyword.js';



export const getTask = async (req, res, next) => {
  const { activityid } = req.params;

  try {
    const activity = await Activity.findOne({
      where: {
        id: activityid,
        userId: req.userId,
      },
      include: [
        {
          model: Keyword,
          required: true,
          attributes: ['id', 'name', 'colorAngle'],
          through: { attributes: [] },
        },
        {
          model: Task,
          required: true,
          attributes: ['id', 'startPeriod', 'endPeriod', 'frequenceIntervalDays', 'frequenceWeeklyDays'],
          include: [
            {
              model: Step,
              required: false,
              attributes: ['id', 'description', 'index'],
            },
          ],
        },
      ],
    });

    console.log('[GET TASK] Task title: ' + activity.title);
    res.status(200).json({
      message: 'Fetched Activities successfully.',
      task: activity
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};


export const getTaskInstance = async (req, res, next) => {
  const { activityid, instanceid } = req.params;

  try {
    const activity = await Activity.findOne({
      where: {
        id: activityid,
        userId: req.userId,
      },
      include: [
        {
          model: Keyword,
          required: true,
          attributes: ['id', 'name', 'colorAngle'],
          through: { attributes: [] },
        },
        {
          model: Task,
          required: true,
          attributes: ['id', 'startPeriod', 'endPeriod', 'frequenceIntervalDays', 'frequenceWeeklyDays'],
          include: [
            {
              model: Step,
              required: false,
              attributes: ['id', 'description', 'index'],
            },
            ...(instanceid
              ? [{
                model: TaskInstance,
                required: false,
                where: { id: instanceid },
              }]
              : [])
          ],
        },
      ],
    });
    console.log('[GET TASK + INSTANCE] Task title: ' + activity.title + '  InstanceId: ' + instanceid);
    res.status(200).json({
      message: 'Fetched Activities successfully.',
      task: activity
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};




export const createTask = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const {
    title,
    description,
    keywords,
    difficulty,
    importance,
    createdAt,
    startPeriod,
    endPeriod,
    frequenceIntervalDays,
    frequenceWeeklyDays,
    steps,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    // 1. Criar atividade
    const activity = await Activity.create({
      title,
      description,
      importance,
      difficulty,
      createdAt,
      type: ACTIVITY_TYPE[1], // TASK
      status: STATUS[1], // SPECIALIZED
      userId: req.userId
    }, { transaction });

    points += POINTS.ACTIVITY.CREATE;
    if (description) points += POINTS.ACTIVITY.DESCRIPTION;

    // 2. Atualizar keywords e pontuar
    const { oldKeywords, newKeywords } = await updateActivityKeywords({
      activity,
      newKeywordIds: keywords,
      userId: req.userId,
      transaction
    });

    points += calculateKeywordPoints({
      oldKeywords,
      newKeywords,
      pointValue: POINTS.ACTIVITY.KEYWORD,
      maxCount: 3
    });

    // 3. Criar task vinculada
    const hasPeriodOrFrequency = startPeriod || endPeriod || frequenceIntervalDays || (frequenceWeeklyDays?.length > 0);
    const newTask = await Task.create({
      activityId: activity.id,
      startPeriod,
      endPeriod,
      frequenceIntervalDays,
      frequenceWeeklyDays,
      userId: req.userId
    }, { transaction });

    points += POINTS.TASK.CREATE;
    if (hasPeriodOrFrequency) points += POINTS.TASK.PERIOD_AND_FREQUENCY;

    // 4. Criar steps, se houver
    if (steps && steps.length > 0) {
      for (const step of steps) {
        const newStep = await Step.create(
          { description: step.description, index: step.index },
          { transaction }
        );
        await newTask.addStep(newStep, { transaction });
      }
      points += steps.length * POINTS.TASK.STEP.CREATE;
    }

    // 5. Aplicar pontos
    await applyUserPoints({ userId: req.userId, points, transaction });

    // 6. Commit e resposta
    await transaction.commit();

    console.log(`[CREATE TASK] Title: "${activity.title}", Points: ${points}`);

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error.message);

    res.status(500).json({
      message: 'Creating task failed',
      error: error.message,
    });
  }
};



export const updateTask = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { id } = req.params;
  const userId = req.userId;
  const { keywords, ...rest } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    // Buscar atividade e validar
    const activity = await Activity.findOne({ where: { id, userId }, transaction });
    if (!activity) {
      return res.status(404).json({ message: `Activity with ID ${id} not found.` });
    }

    // Atualização da atividade
    if (rest.description && !activity.description) {
      points += POINTS.ACTIVITY.DESCRIPTION;
    }

    Object.assign(activity, buildActivityUpdateData(rest, userId));
    await activity.save({ transaction });

    // Atualização de palavras-chave
    const { oldKeywords, newKeywords } = await updateActivityKeywords({
      activity,
      newKeywordIds: keywords,
      userId,
      transaction
    });

    points += calculateKeywordPoints({
      oldKeywords,
      newKeywords,
      pointValue: POINTS.ACTIVITY.KEYWORD,
      maxCount: 3
    });

    // Buscar tarefa vinculada
    const task = await Task.findOne({ where: { id: activity.id, userId } });
    if (!task) {
      return res.status(404).json({ message: `Related Task not found for activity ID ${id}.` });
    }

    if (isSettingPeriodOrFrequencyForFirstTime(task, rest)) {
      points += POINTS.TASK.PERIOD_AND_FREQUENCY;
    }

    // Atualizar tarefa
    Object.assign(task, buildTaskUpdateData(rest));
    await task.save({ transaction });

    await applyUserPoints({ userId, points, transaction });
    await transaction.commit();

    console.log(`[UPDATE TASK] Title: "${activity.title}", Points: ${points}`);

    res.status(200).json({
      message: 'Task updated successfully',
      task: activity,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('[UPDATE TASK ERROR]', error.message);

    res.status(500).json({
      message: 'Updating task failed',
      error: error.message,
    });
  }
};


export const upsertSteps = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { id } = req.params;
  const userId = req.userId;
  const steps = req.body;

  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    const task = await Task.findOne({
      where: { id, userId },
      transaction,
    });

    if (!task) {
      return res.status(404).json({ message: 'Related Task not found.' });
    }

    const existingSteps = await Step.findAll({
      where: { taskId: task.id },
      transaction,
    });

    const existingCount = Math.min(existingSteps.length, 3);
    const receivedIds = steps.filter(s => s.id).map(s => s.id);
    const stepsToDelete = existingSteps.filter(s => !receivedIds.includes(s.id));

    // Deletar steps removidos
    for (const step of stepsToDelete) {
      await step.destroy({ transaction });
    }

    // Atualizar ou criar steps
    for (const step of steps) {
      if (step.id) {
        const existingStep = existingSteps.find(s => s.id === step.id);
        if (existingStep) {
          await existingStep.update({
            description: step.description,
            index: step.index,
          }, { transaction });
        }
      } else {
        await Step.create({
          description: step.description,
          index: step.index,
          taskId: task.id,
        }, { transaction });
      }
    }

    const updatedSteps = await Step.findAll({
      where: { taskId: task.id },
      transaction,
    });

    const updatedCount = Math.min(updatedSteps.length, 3);

    // Aplicar pontuação pela diferença de quantidade
    if (updatedCount > existingCount && updatedCount <= 3) {
      points += (updatedCount - existingCount) * POINTS.TASK.STEP.CREATE;
    } else if (updatedCount < existingCount && updatedCount < 3) {
      points -= (existingCount - updatedCount) * POINTS.TASK.STEP.CREATE;
    }

    // Aplicar os pontos ao usuário
    await applyUserPoints({ userId, points, transaction });

    await transaction.commit();

    console.log('[UPSERT STEPS] TaskId: ' + task.id + ', Points: ' + points);

    res.status(201).json({
      message: 'Steps updated successfully',
      steps: updatedSteps,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error.message);

    res.status(500).json({
      message: 'Updated Steps failed',
      error: error.message,
    });
  }
};



export const createInstance = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { id } = req.params;
  const userId = req.userId;
  const { finalDate, completedOn, status, stepCompletionStatus } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    const task = await Task.findOne({ where: { id: id, userId } });

    if (!task) return res.status(404).json({ message: 'Related Task not found.' });

    const sanitizedStepStatus = await sanitizeStepCompletionStatus(stepCompletionStatus ?? [], transaction);

    const stepPoints = calculateStepCompletionPoints([], sanitizedStepStatus);
    points += stepPoints;

    const instance = await TaskInstance.create({
      finalDate,
      completedOn: completedOn ?? null,
      status: status ?? INSTANCE_STATUS[0], // ACTIVE,
      stepCompletionStatus: sanitizedStepStatus.length > 0 ? sanitizedStepStatus : [],
      userId,
      taskId: task.id
    },
      { transaction }
    );
    if (completedOn) points += POINTS.TASK.DONE;

    if (instance.status === INSTANCE_STATUS[2]) { // DELETED
      task.deletedInstances = [...(task.deletedInstances || []), instance.finalDate];
      if (completedOn) points -= POINTS.TASK.DONE;
      await task.save({ transaction });
    };

    await applyUserPoints({ userId, points, transaction });

    await transaction.commit();

    console.log('[CREATE TASK INSTANCE] finalDate: ' + new Date(instance.finalDate).toDateString() + ', Points: ' + points);

    res.status(201).json({
      message: 'Create TaskInstance successfully',
      instance: instance,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);

    res.status(500).json({
      message: 'Create TaskInstance failed',
      error: error.message,
    });
  }
};



export const updateInstance = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { taskid, instanceid } = req.params;
  const userId = req.userId;
  const { completedOn, status, stepCompletionStatus } = req.body;

  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    const task = await Task.findOne({ where: { id: taskid, userId } });
    if (!task) return res.status(404).json({ message: 'Related Task not found.' });

    const instance = await TaskInstance.findOne({ where: { id: instanceid, userId } });
    if (!instance) return res.status(404).json({ message: 'TaskInstance not found.' });

    const oldStepStatus = instance.stepCompletionStatus || [];
    const sanitizedStepStatus = await sanitizeStepCompletionStatus(stepCompletionStatus ?? oldStepStatus, transaction);
    const stepPoints = calculateStepCompletionPoints(oldStepStatus, sanitizedStepStatus);
    points += stepPoints;

    const wasCompleted = !!instance.completedOn;
    const isNowCompleted = !!completedOn;
    if (!wasCompleted && isNowCompleted) points += POINTS.TASK.DONE;
    if (wasCompleted && !isNowCompleted) points -= POINTS.TASK.DONE;
    
    instance.completedOn = completedOn ?? null;
    instance.status = status ?? instance.status;
    instance.stepCompletionStatus = sanitizedStepStatus.length > 0 ? sanitizedStepStatus : [];

    if (instance.status === STATUS[3]) {
      task.deletedInstances = [...(task.deletedInstances || []), instance.finalDate];
      await task.save({ transaction });
    };

    await instance.save({ transaction });

    await applyUserPoints({ userId, points, transaction });

    await transaction.commit();

    console.log('[UPDATE TASK INSTANCE] FinalDate: ', new Date(instance.finalDate).toDateString(), 'Points:', points);

    res.status(201).json({
      message: 'Create TaskInstance successfully',
      instance: instance,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);

    res.status(500).json({
      message: 'Create TaskInstance failed',
      error: error.message,
    });
  }
};