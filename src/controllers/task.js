import sequelize from '../util/db.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';

import Activity from '../models/activity/activity.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import { STATUS, ACTIVITY_TYPE } from '../util/enum.js';
import { Op } from 'sequelize';
import { buildActivityUpdateData } from '../util/helpers/controller-activity.js';
import { buildTaskUpdateData } from '../util/helpers/controller-task.js';
import TaskInstance from '../models/task/taskInstance.js';



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
  };

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
    const newActivity = await Activity.create({
      title: title,
      description: description,
      importance: importance,
      difficulty: difficulty,
      createdAt: createdAt,
      type: ACTIVITY_TYPE[1], // TASK
      status: STATUS[1], // SPECIALIZED
      userId: req.userId
    },
      { transaction }
    );

    const keywordsFetched = await Keyword.findAll({
      where: {
        id: keywords,
        userId: {
          [Op.or]: [req.userId, null]
        }
      }
    },
      { transaction }
    );

    await newActivity.setKeywords(keywordsFetched, { transaction });

    const newTask = await Task.create(
      {
        activityId: newActivity.id,
        startPeriod: startPeriod,
        endPeriod: endPeriod,
        frequenceIntervalDays: frequenceIntervalDays,
        frequenceWeeklyDays: frequenceWeeklyDays,
        userId: req.userId
      },
      { transaction }
    );

    if (steps) {
      for (const step of steps) {
        const newStep = await Step.create(
          {
            description: step.description,
            index: step.index
          },
          { transaction }
        );
        await newTask.addStep(newStep, { transaction });
      };
    };

    await transaction.commit();

    console.log('[CREATE TASK] title:' + newActivity.title + ', desc:' + newActivity.description)

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message)

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
  };

  const { id } = req.params;
  const userId = req.userId;
  const { keywords, ...rest } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const activity = await Activity.findOne({
      where: { id, userId },
      transaction,
    });

    if (!activity) {
      return res.status(404).json({ message: 'Task not found.' });
    };

    const activityUpdateData = buildActivityUpdateData(rest, userId);
    Object.assign(activity, activityUpdateData);
    await activity.save({ transaction });

    const keywordsFetched = await Keyword.findAll({
      where: {
        id: keywords,
        userId: { [Op.or]: [req.userId, null] }
      }
    }, { transaction }
    );

    await activity.setKeywords(keywordsFetched, { transaction });

    const task = await Task.findOne({
      where: { id: activity.id, userId },
      transaction,
    });
    const taskUpdateData = buildTaskUpdateData(rest);
    taskUpdateData.startPeriod = rest.startPeriod ?? null;
    taskUpdateData.endPeriod = rest.endPeriod ?? null;
    taskUpdateData.frequenceIntervalDays = rest.frequenceIntervalDays ?? null;
    taskUpdateData.frequenceWeeklyDays = rest.frequenceWeeklyDays ?? null;
    Object.assign(task, taskUpdateData);
    await task.save({ transaction });

    await transaction.commit();

    console.log('[UPDATE TASK] id:' + activity.id + ', title:' + activity.title)

    res.status(201).json({
      message: 'Task updated successfully',
      task: activity,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message)

    res.status(500).json({
      message: 'Updated task failed',
      error: error.message,
    });
  }
};


export const upsertSteps = async (req, res, next) => {
  console.log('[UPSERT STEPS] Request body: ', req.body);
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { id } = req.params;
  const userId = req.userId;
  const steps = req.body;
  console.log('steps: ', steps);
  const transaction = await sequelize.transaction();

  try {
    const task = await Task.findOne({
      where: { id, userId },
      transaction,
    });
    if (!task) return res.status(404).json({ message: 'Related Task not found.' });


    const existingSteps = await Step.findAll({
      where: { taskId: task.id },
      transaction,
    });

    const receivedIds = steps.filter(s => s.id).map(s => s.id);
    const stepsToDelete = existingSteps.filter(s => !receivedIds.includes(s.id));

    for (const step of stepsToDelete) {
      await step.destroy({ transaction });
    }

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
      };
    };

    console.log('[UPSERT STEPS] TaskId: ' + task.id);

    await transaction.commit();

    const fetchedSteps = await Step.findAll({ where: { taskId: id } })

    res.status(201).json({
      message: 'Steps updated successfully',
      steps: fetchedSteps,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);

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
    const task = await Task.findOne({
      where: { id: id, userId },
      transaction,
    });
    if (!task) return res.status(404).json({ message: 'Related Task not found.' });


    const newInstance = await TaskInstance.create({
      finalDate: finalDate,
      completedOn: completedOn ?? null,
      status: status ?? null,
      stepCompletionStatus: stepCompletionStatus ?? null,
      userId: req.userId,
      taskId: task.id
    },
      { transaction }
    );

    if (newInstance.status === STATUS[3]) { // DELETED
      task.deletedInstances = [...(task.deletedInstances || []), newInstance.finalDate];
      await task.save({ transaction });
    };

    await transaction.commit();

    console.log('[CREATE TASK INSTANCE] finalDate: ' + newInstance.finalDate);

    res.status(201).json({
      message: 'Create TaskInstance successfully',
      instance: newInstance,
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
  console.log('TESTANDO AQUI')
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { taskid, instanceid } = req.params;
  const userId = req.userId;
  const { /*finalDate,*/ completedOn, status, stepCompletionStatus } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const task = await Task.findOne({
      where: { id: taskid, userId },
    });
    if (!task) return res.status(404).json({ message: 'Related Task not found.' });


    const instance = await TaskInstance.findOne({
      where: { id: instanceid, userId: req.userId }
    });

    instance.completedOn = completedOn ?? null;
    instance.status = status ?? instance.status;
    instance.stepCompletionStatus = stepCompletionStatus ?? instance.stepCompletionStatus;

    if (instance.status === STATUS[3]) { // DELETED
      task.deletedInstances = [...(task.deletedInstances || []), instance.finalDate];
      await task.save({ transaction });
    };

    await instance.save({ transaction });

    await transaction.commit();

    console.log('[UPDATE TASK INSTANCE] InstanceId: ' + instance.id + ', completedOn: ' + instance.completedOn);

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