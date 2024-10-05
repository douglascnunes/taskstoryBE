const sequelize = require('../util/db.js');

const Activity = require('../models/activity/activity.js');
const Task = require('../models/task/task.js');



exports.createTask = async (req, res, next) => {
  const {
    title,
    description,
    activityType,
    initialDate,
    finalDate,
    frequenceIntervalDays,
    frequenceWeeklyDays,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const activity = await Activity.create(
      {
        title: title,
        description: description,
        activityType: activityType,
      },
      { transaction }
    );

    const task = await Task.create(
      {
        activityId: activity.id,
        initialDate: initialDate,
        finalDate: finalDate,
        frequenceIntervalDays: frequenceIntervalDays,
        frequenceWeeklyDays: frequenceWeeklyDays,
      },
      { transaction }
    );
    await transaction.commit();

    res.status(201).json({
      message: 'Task created successfully',
      task: task,
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: 'Creating task failed',
      error: error.message,
    });
  }
};