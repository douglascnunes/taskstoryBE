import sequelize from '../util/db.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';

import Activity from '../models/activity/activity.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import { STATUS, ACTIVITY_TYPE, INSTANCE_STATUS } from '../util/enum.js';
import { POINTS } from '../util/points.js';
import { buildActivityUpdateData } from '../util/helpers/controller-activity.js';
import { buildTaskUpdateData, calculateStepCompletionDiff, isSettingPeriodOrFrequencyForFirstTime, sanitizeStepCompletionStatus } from '../util/helpers/controller-task.js';
import TaskInstance from '../models/task/taskInstance.js';
import { awardsPoints } from '../util/helpers/controller-user.js';
import { updateActivityKeywords } from '../util/helpers/controller-keyword.js';
import { Op, Sequelize } from 'sequelize';



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
                as: 'instance',
                required: false,
                where: { id: instanceid },
              }]
              : [])
          ],
        },
        {
          model: Keyword,
          required: true,
          attributes: ['id', 'name', 'colorAngle'],
          through: { attributes: [] },
        },
        {
          association: "dependencies",
          required: false,
          through: {
            attributes: ['instanceId','depInstanceId', 'type', 'description'],
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
              required: false,
              include: [
                {
                  model: TaskInstance,
                  required: false,
                  as: 'instance',
                  where: {
                    id: {
                      [Op.col]: 'dependencies.dependency.depInstanceId'
                    }
                  }
                },
                // { model: Step, required: false },
              ]
            },
            // {
            //   model: Habit,
            //   required: false,
            //   include: [
            //     { model: HabitInstance, where: { status: 'ACTIVE' }, required: false }
            //   ]
            // },
            // {
            //   model: Goal,
            //   required: false,
            //   include: [
            //     { model: GoalInstance, where: { status: 'ACTIVE' }, required: false }
            //   ]
            // }
            {
              association: "dependencies",
              required: false,
              // through: {
              //   attributes: ['depInstanceId', 'type', 'description'],
              // },
              // include: [
              //   {
              //     model: Keyword,
              //     required: true,
              //     attributes: ['id', 'name', 'colorAngle'],
              //     through: { attributes: [] },
              //   },
              //   {
              //     model: Task,
              //     required: false,
              //     include: [
              //       {
              //         model: TaskInstance,
              //         required: false,
              //         as: 'instance',
              //         where: {
              //           id: Sequelize.col('dependencies->dependency.depInstanceId')
              //         }
              //       },
              //     ]
              //   },
              // ]
            },
          ]
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

  console.log(req.body)

  const transaction = await sequelize.transaction();

  try {
    let awardsActions = [];

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

    awardsActions.push([POINTS.ACTIVITY.CREATE, 1]);
    if (description) awardsActions.push([POINTS.ACTIVITY.DESCRIPTION, 1]);

    // 2. Atualizar keywords e pontuar
    const { oldKeywords, newKeywords } = await updateActivityKeywords({
      activity,
      newKeywordIds: keywords,
      userId: req.userId,
      transaction
    });

    awardsActions.push([POINTS.ACTIVITY.KEYWORD, Math.min(newKeywords.length, 3)]);

    // 3. Criar task vinculada
    const hasPeriodOrFrequency = startPeriod || endPeriod || frequenceIntervalDays || (frequenceWeeklyDays?.length > 0);
    const newTask = await Task.create({
      activityId: activity.id,
      startPeriod: startPeriod ?? null,
      endPeriod: endPeriod ?? null,
      frequenceIntervalDays: frequenceIntervalDays ?? null,
      frequenceWeeklyDays: frequenceWeeklyDays ?? null,
      userId: req.userId
    }, { transaction });

    awardsActions.push([POINTS.TASK.CREATE, 1]);

    if (hasPeriodOrFrequency) awardsActions.push([POINTS.TASK.PERIOD_AND_FREQUENCY, 1]);

    // 4. Criar steps, se houver
    if (steps && steps.length > 0) {
      for (const step of steps) {
        const newStep = await Step.create(
          { description: step.description, index: step.index },
          { transaction }
        );
        await newTask.addStep(newStep, { transaction });
      }
      awardsActions.push([POINTS.TASK.STEP.CREATE, steps.length]);
    }

    // 5. Aplicar pontos
    const resultPoints = await awardsPoints(req.userId, awardsActions, transaction);

    // 6. Commit e resposta
    await transaction.commit();

    console.log(
      '[CREATE TASK] title:' + activity.title +
      ', Level Points:' + resultPoints.diffLevelPoints +
      ', Self-Reg Points:' + resultPoints.diffSelfRegPoints +
      ', Self-Eff Points:' + resultPoints.diffSelfEffPoints
    );

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
    let awardsActions = [];

    const activity = await Activity.findOne({ where: { id, userId }, transaction });
    if (!activity) {
      return res.status(404).json({ message: `Activity with ID ${id} not found.` });
    }

    if (rest.description && !activity.description) awardsActions.push([POINTS.ACTIVITY.DESCRIPTION, 1]);
    if (!rest.description && activity.description) awardsActions.push([POINTS.ACTIVITY.DESCRIPTION, -1]);

    Object.assign(activity, buildActivityUpdateData(rest, userId));
    await activity.save({ transaction });

    if (keywords) {
      const { oldKeywords, newKeywords } = await updateActivityKeywords({
        activity,
        newKeywordIds: keywords,
        userId,
        transaction
      });

      awardsActions.push([
        POINTS.KEYWORD.CREATE,
        Math.max(-2, Math.min(2, oldKeywords.length - newKeywords.length))
      ]);
    }

    const task = await Task.findOne({ where: { id: activity.id, userId }, transaction });
    if (!task) {
      return res.status(404).json({ message: `Related Task not found for activity ID ${id}.` });
    }

    if (isSettingPeriodOrFrequencyForFirstTime(task, rest)) awardsActions.push([POINTS.TASK.PERIOD_AND_FREQUENCY, 1]);


    Object.assign(task, buildTaskUpdateData(rest));

    await task.save({ transaction });

    const resultPoints = await awardsPoints(userId, awardsActions, transaction);

    await transaction.commit();

    console.log(
      '[UPDATE TASK] title:' + activity.title +
      ', Level Points:' + resultPoints.diffLevelPoints +
      ', Self-Reg Points:' + resultPoints.diffSelfRegPoints +
      ', Self-Eff Points:' + resultPoints.diffSelfEffPoints
    );

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
    let awardsActions = [];

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

    awardsActions.push([
      POINTS.TASK.STEP.CREATE,
      Math.max(-2, Math.min(2, updatedSteps.length - existingSteps.length))
    ]);

    // Aplicar os pontos ao usuário
    const resultPoints = await awardsPoints(userId, awardsActions, transaction);

    await transaction.commit();

    console.log(
      '[UPSERT STEPS] id:' + task.id +
      ', Level Points:' + resultPoints.diffLevelPoints +
      ', Self-Reg Points:' + resultPoints.diffSelfRegPoints +
      ', Self-Eff Points:' + resultPoints.diffSelfEffPoints
    );

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
    let awardsActions = [];

    const task = await Task.findOne({ where: { id: id, userId } });

    if (!task) return res.status(404).json({ message: 'Related Task not found.' });

    const sanitizedStepStatus = await sanitizeStepCompletionStatus(stepCompletionStatus ?? [], transaction);

    const stepCompletionDiff = calculateStepCompletionDiff([], sanitizedStepStatus);
    awardsActions.push([POINTS.TASK.STEP.DONE, stepCompletionDiff]);

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
    if (completedOn) awardsActions.push([POINTS.TASK.DONE, 1]);

    if (instance.status === INSTANCE_STATUS[2]) { // DELETED
      task.deletedInstances = [...(task.deletedInstances || []), instance.finalDate];
      awardsActions.push([POINTS.TASK.STEP.DONE, sanitizedStepStatus.length * -1]);
      if (completedOn) awardsActions.push([POINTS.TASK.DONE, -1]);
      await task.save({ transaction });
    };

    const resultPoints = await awardsPoints(userId, awardsActions, transaction);

    await transaction.commit();

    console.log(
      '[CREATE TASK INSTANCE] finalDate: ' + new Date(instance.finalDate).toDateString() +
      ', Level Points:' + resultPoints.diffLevelPoints +
      ', Self-Reg Points:' + resultPoints.diffSelfRegPoints +
      ', Self-Eff Points:' + resultPoints.diffSelfEffPoints
    );

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
    let awardsActions = [];

    const task = await Task.findOne({ where: { id: taskid, userId } });
    if (!task) return res.status(404).json({ message: 'Related Task not found.' });

    const instance = await TaskInstance.findOne({ where: { id: instanceid, userId } });
    if (!instance) return res.status(404).json({ message: 'TaskInstance not found.' });

    const oldStepStatus = instance.stepCompletionStatus || [];
    const sanitizedStepStatus = await sanitizeStepCompletionStatus(stepCompletionStatus ?? oldStepStatus, transaction);
    const stepCompletionDiff = calculateStepCompletionDiff(oldStepStatus, sanitizedStepStatus);
    awardsActions.push([POINTS.TASK.STEP.DONE, stepCompletionDiff]);

    const wasCompleted = !!instance.completedOn;
    const isNowCompleted = !!completedOn;

    const wasLate = instance.completedOn && new Date(instance.completedOn) > new Date(instance.finalDate);
    const isLateNow = completedOn && new Date(completedOn) > new Date(instance.finalDate);

    if (!wasCompleted && isNowCompleted) {
      awardsActions.push([isLateNow ? POINTS.TASK.DONE_LATE : POINTS.TASK.DONE, 1]);
    }

    if (wasCompleted && !isNowCompleted) {
      awardsActions.push([wasLate ? POINTS.TASK.DONE_LATE : POINTS.TASK.DONE, -1]);
    }

    instance.completedOn = completedOn ?? null;
    instance.status = status ?? instance.status;
    instance.stepCompletionStatus = sanitizedStepStatus.length > 0 ? sanitizedStepStatus : [];

    if (instance.status === STATUS[3]) { // DELETED
      if (completedOn) awardsActions.push([wasLate ? POINTS.TASK.DONE_LATE : POINTS.TASK.DONE, -1]);
      awardsActions.push([POINTS.TASK.STEP.DONE, instance.stepCompletionStatus.length * -1]);
      task.deletedInstances = [...(task.deletedInstances || []), instance.finalDate];
      await task.save({ transaction });
    };

    const resultPoints = await awardsPoints(userId, awardsActions, transaction);

    await instance.save({ transaction })

    await transaction.commit();

    console.log('[UPDATE TASK INSTANCE] FinalDate: ', new Date(instance.finalDate).toDateString() +
      ', Level Points:' + resultPoints.diffLevelPoints +
      ', Self-Reg Points:' + resultPoints.diffSelfRegPoints +
      ', Self-Eff Points:' + resultPoints.diffSelfEffPoints
    );

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



export const upsertDependencies = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { instanceid } = req.params;
  const userId = req.userId;

  const rawDependencies = req.body;

  const transaction = await sequelize.transaction();

  try {
    const activity = await Activity.findOne({
      where: { id, userId },
      transaction,
    });

    if (!activity) {
      return res.status(404).json({ message: 'Related Activity not found.' });
    }

    await Dependency.destroy({
      where: { activityId: id },
      transaction,
    });

    const records = rawDependencies.map(
      ([dependencyId, dependencyInstanceId, dependentInstanceId, type, description]) => ({
        activityId: id,
        dependencyId,
        dependencyInstanceId,
        dependentInstanceId,
        type,
        description: description || null,
      })
    );

    if (records.length > 0) {
      await Dependency.bulkCreate(records, { transaction });
    };

    await transaction.commit();

    console.log('[UPSERT DEPENDENCIES] Activity: ' + activity.id);

    res.status(201).json({
      message: 'Dependencies updated successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error.message);

    res.status(500).json({
      message: 'Updated Dependencies failed',
      error: error.message,
    });
  }
};
