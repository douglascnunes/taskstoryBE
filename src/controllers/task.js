import sequelize from '../util/db.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';

import Activity from '../models/activity/activity.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from '../util/enum.js';
import { Op } from 'sequelize';


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
      type: ACTIVITY_TYPE[1], // TASK
      status: ACTIVITY_STATUS[1], // SPECIALIZED
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
      },
      { transaction }
    );

    if (steps) {
      for (const stepDescription of steps) {
        const step = await Step.create(
          {
            description: stepDescription,
          },
          { transaction }
        );
        await newTask.addStep(step, { transaction });
      }
    }

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