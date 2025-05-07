import { Op, Sequelize } from 'sequelize';
import { validationResult as expValidatorRes } from 'express-validator';

import sequelize from '../util/db.js';
import { controllerErrorObj } from '../util/error.js';
import { ACTIVITY_TYPE, PRIORITY_VALUES, SPECIALIZATION_STATUS } from '../util/enum.js';

import Activity from '../models/activity/activity.js';
import AreaOfLife from '../models/areaOfLife/areaOfLife.js';
import Keyword from '../models/areaOfLife/keyword.js';
import ActivityKeyword from '../models/activity/activityKeyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import Habit from '../models/habit/habit.js';
import HabitLevel from '../models/habit/habitLevel.js';
import HabitPhase from '../models/habit/habitPhase.js';
import TaskInstance from '../models/task/taskInstance.js';
import Goal from '../models/goal/goal.js';
import Challenge from '../models/goal/challenge.js';
import GoalInstance from '../models/goal/goalInstance.js';
import { parseDateOnly } from '../util/date.js';
import { getTaskPeriodFilter } from '../util/whereSequelize/task.js';


export const getOverview = async (req, res, next) => {
  try {
    let { startdate, finaldate } = req.query;
    startdate = startdate ? new Date(decodeURIComponent(startdate)) : null;
    finaldate = finaldate ? new Date(decodeURIComponent(finaldate)) : null;

    if (!startdate) {
      startdate = new Date();
      startdate.setMonth(startdate.getMonth() - 2);
    }
    if (!finaldate) {
      finaldate = new Date();
      finaldate.setMonth(finaldate.getMonth() + 2);
    }
    if (startdate > finaldate) {
      return res.status(400).json({ message: 'startDate deve ser anterior a finalDate.' });
    }

    const activities = await Activity.findAll({
      where: {
        userId: req.userId,
        type: ACTIVITY_TYPE[1], //'SPECIALIZED'
      },
      include: [
        {
          model: Keyword,
          required: true,
          attributes: ['name', 'colorAngle'],
          through: { attributes: [] },
        },
        {
          model: Task,
          required: true,
          where: getTaskPeriodFilter(startdate, finaldate),
          include: [
            { model: Step, required: false },
            {
              model: TaskInstance,
              required: false,
              where: {
                finalDate: {
                  [Op.between]: [startdate, finaldate],
                },
                currentStatus: {
                  [Op.in]: [
                    SPECIALIZATION_STATUS[1], // 'TODO'
                    SPECIALIZATION_STATUS[2], // 'TODO_LATE'
                    SPECIALIZATION_STATUS[3], // 'WAITING'
                    SPECIALIZATION_STATUS[4], // 'WAITING_LATE'
                    SPECIALIZATION_STATUS[5], // 'DOING'
                    SPECIALIZATION_STATUS[6], // 'DOING_LATE'
                    SPECIALIZATION_STATUS[7], // 'COMPLETED'
                    SPECIALIZATION_STATUS[8], // 'COMPLETED_LATE'
                  ],
                },
              },
            },
          ]
        },
      ]
    },
      {
        model: Habit,
        required: false,
        include: [
          { model: HabitLevel, required: true },
          { model: HabitPhase, require: true }
        ]
      },
      {
        model: Goal,
        required: false,
        include: [
          { model: Challenge, required: false },
          { model: GoalInstance, required: false }
        ]
      },
    );

    console.log('[GET OVERVIEW] Activities quant: ' + activities.length);
    res.status(200).json({
      message: 'Fetched Overview Activities successfully.',
      activities: activities,
      startdate: startdate,
      finaldate: finaldate,
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getFilteredActivities = async (req, res, next) => {
  const { status, type, keyword, areaoflife, searchtext, priority } = req.query;

  const decodedType = type ? decodeURIComponent(type) : null;
  const decodedAreaOfLife = areaoflife ? decodeURIComponent(areaoflife) : null;
  const decodedKeyword = keyword ? decodeURIComponent(keyword) : null;
  const decodedSearchText = searchtext ? decodeURIComponent(searchtext) : null;
  const decodedPriority = priority ? decodeURIComponent(priority) : null;


  try {
    let filters = {};

    // Search Status
    if (status) {
      const statusArray = status.split(',').map(s => s.toUpperCase());
      filters.currentStatus = statusArray;
    }

    // Search Activity Type
    if (type) {
      const typeArray = decodedType.split(',').map(t => t.toUpperCase());
      filters.type = typeArray;
    }

    // Search AreOfLife
    let foundAreaOfLifesIds = []
    if (decodedAreaOfLife) {
      const foundAreaOfLifes = await AreaOfLife.findAll({
        attributes: ['id'],
        where: {
          name: decodedAreaOfLife.split(',')
        }
      });
      if (foundAreaOfLifes) {
        foundAreaOfLifesIds = foundAreaOfLifes.map(p => p.id);
      };
    };



    // Search Keyword
    if (decodedKeyword || decodedAreaOfLife) {
      const foundKeywords = await Keyword.findAll({
        attributes: ['id'],
        where: {
          [Op.or]: [
            (decodedKeyword ? { name: decodedKeyword.split(',') } : null),
            { areaOfLifeId: foundAreaOfLifesIds }
          ],
          userId: { [Op.or]: [req.userId, null] }
        }
      });
      if (foundKeywords) {
        const activitiesQueryKeyword = await ActivityKeyword.findAll({
          attributes: ['activityId'],
          group: ['activityId'],
          where: { keywordId: foundKeywords.map(k => k.id) }
        })
        filters.id = activitiesQueryKeyword.map(k => k.activityId);
      };
    };

    // Search Text (title or description)
    if (decodedSearchText) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${decodedSearchText}%` } },
        { description: { [Op.like]: `%${decodedSearchText}%` } }
      ];
    }

    if (decodedPriority && PRIORITY_VALUES[decodedPriority]) {
      const [min, max] = PRIORITY_VALUES[decodedPriority];
      filters[Op.and] = [
        ...filters[Op.and] || [],
        Sequelize.literal(`(importance + difficulty) / 2 >= ${min} AND (importance + difficulty) / 2 < ${max}`)
      ];
    };

    const activities = await Activity.findAll({
      where: filters,
      include: [
        {
          model: Task,
          required: false,
          include: [
            { model: Step, required: false },
            { model: TaskInstance, required: false }
          ]
        },
        {
          model: Habit,
          required: false,
          include: [
            { model: HabitLevel, required: true },
            { model: HabitPhase, require: true }
          ]
        },
        {
          model: Goal,
          required: false,
          include: [
            { model: Challenge, required: false },
            { model: GoalInstance, required: false }
          ]
        },
      ]
    });

    res.status(200).json({
      message: 'Fetched Activities successfully.',
      activities: activities
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};


export const getAcitivity = async (req, res, next) => {
  const { activityId, instanceId } = req.query;

  try {
    const activity = await Activity.findOne({
      where: {
        id: activityId,
        userId: req.userId,
      },
      include: [
        {
          model: Task,
          required: false,
          include: [
            { model: Step, required: false },
            ...(instanceId
              ? [{
                model: TaskInstance,
                required: false,
                where: { id: instanceId },
              }]
              : [])
          ],
        },
      ],
    });

    res.status(200).json({
      message: 'Fetched Activities successfully.',
      activities: activity
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};


export const createActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  };

  const {
    title,
    description,
    keywords,
    createdAt,
    difficulty,
    importance,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const newActivity = await Activity.create({
      title: title,
      description: description,
      importance: importance,
      difficulty: difficulty,
      createdAt: parseDateOnly(createdAt),
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

    await transaction.commit();

    console.log('[CREATE ACTIVITY] title:' + newActivity.title + ', desc:' + newActivity.description)
    res.status(201).json({
      message: 'Activity created successfully!',
      activity: newActivity,
    });
  }
  catch (err) {
    await transaction.rollback();

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


export const updateActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const {
    activityId,
    title,
    description,
    keywords,
    importance,
    difficulty,
    createAt,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const updatedActivity = await Activity.findOne({
      where: {
        id: activityId,
        userId: req.userId,
      },

    });

    if (!updatedActivity || updatedActivity.status === 'SPECIALIZED') {
      return res.status(404).json({ message: 'Activity not found.' });
    };

    const updatedFields = {};

    if (title) updatedFields.title = title;

    if (description) updatedFields.description = description;

    if (importance) updatedFields.importance = importance;

    if (difficulty) updatedFields.difficulty = difficulty;

    if (createAt) updatedFields.createAt = createAt;

    await updatedActivity.update(
      updatedFields,
      { transaction }
    );


    const keywordsFetched = await Keyword.findAll({
      where: {
        id: keywords,
        userId: {
          [Op.or]: [req.userId, null]
        }
      }
    });
    await updatedActivity.setKeywords(keywordsFetched, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Activity updated successfully!',
      activity: updatedActivity,
    });
  }
  catch (err) {
    await transaction.rollback();

    if (!err.statusCode) {
      err.message = 'Updated Activity failed',
        err.statusCode = 500;
    }
    next(err);
  }
};