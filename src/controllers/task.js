import sequelize from '../util/db.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';

import Activity from '../models/activity/activity.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';

export const createTask = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const {
    title,
    description,
    keywords,
    initialDate,
    finalDate,
    frequenceIntervalDays,
    frequenceWeeklyDays,
    steps,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const newActivity = await Activity.create(
      {
        title: title,
        description: description,
        activityType: 'TASK',
      },
      { transaction }
    );

    const newTask = await Task.create(
      {
        activityId: newActivity.id,
        initialDate: initialDate,
        finalDate: finalDate,
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

    const keywordsFetched = await Keyword.findAll({
      where: { name: keywords },
    });

    await newActivity.setKeywords(keywordsFetched, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: 'Creating task failed',
      error: error.message,
    });
  }
};