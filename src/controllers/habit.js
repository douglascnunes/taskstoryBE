const sequelize = require('../util/db.js');
const errorHelper = require('../util/error.js');

const expValidatorRes = require('express-validator').validationResult;


const Activity = require('../models/activity/activity.js');
const Keyword = require('../models/areaOfLife/keyword.js');

const Habit = require('../models/habit/habit.js');
const HabitLevel = require('../models/habit/habitLevel.js');
const HabitPhase = require('../models/habit/habitPhase.js');


exports.createHabit = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const {
    title,
    description,
    keywords,
    frequenceIntervalDays,
    frequenceWeeklyDays,
    notificationType,
    notificationHours,
    goalType,
    goalDescription,
    goalValueI,
    goalValueF,
  } = req.body;


  const transaction = await sequelize.transaction();

  try {
    const newActivity = await Activity.create(
      {
        title: title,
        description: description,
        activityType: 'HABIT',
      },
      { transaction }
    );
 
    const habitLevel_1 = await HabitLevel.findOne({where: {id: 1}})
    
    const newHabit = await Habit.create(
      {
        activityId: newActivity.id,
        frequenceIntervalDays: frequenceIntervalDays || null,
        frequenceWeeklyDays: frequenceWeeklyDays || null,
        notificationType: notificationType || 'DESLIGADO',
        notificationHours: notificationHours || null,
        goalType: goalType,
        goalDescription: goalDescription,
        currentExp: 0,
        currentLevel: habitLevel_1.id,
        currentPhase: null
      },
      { transaction }
    );
    
    const newHabitPhase = await HabitPhase.create(
      {
        phaseLevel: 1,
        goalValueI: goalValueI,
        goalValueF: goalValueF || null,
        habitId: newHabit.id
      },
      { transaction }
    )

    await newHabit.update(
      { currentPhase: newHabitPhase.id },
      { transaction }
    );

    const keywordsFetched = await Keyword.findAll({
      where: { name: keywords }
    });

    await newActivity.setKeywords(keywordsFetched, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Habit created successfully',
      task: newHabit,
    });

  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: 'Creating habit failed',
      error: error.message,
    });
  }
};