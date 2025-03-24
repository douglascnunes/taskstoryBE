const sequelize = require('../util/db.js');
const errorHelper = require('../util/error.js');

const expValidatorRes = require('express-validator').validationResult;


const Activity = require('../models/activity/activity.js');
const Keyword = require('../models/areaOfLife/keyword.js');

const Task = require('../models/task/task.js');
const Step = require('../models/task/step.js');


exports.createTask = async (req, res, next) => {
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
      where: { name: keywords }
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