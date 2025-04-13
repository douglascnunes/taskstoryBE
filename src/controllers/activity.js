import { Op } from 'sequelize';
import { validationResult as expValidatorRes } from 'express-validator';

import { controllerErrorObj } from '../util/error.js';
import { ACTIVITY_TYPE, SPECIALIZATION_STATE } from '../util/enum.js';

import Activity from '../models/activity/activity.js';
import AreaOfLife from '../models/areaOfLife/areaOfLife.js';
import Keyword from '../models/areaOfLife/keyword.js';
import Priority from '../models/activity/priority.js';
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
import Difficulty from '../models/activity/difficulty.js';
import Importance from '../models/activity/importance.js';


export const getOverview = async (req, res, next) => {
  try {
    // Pega os valores das query strings e faz a decodificação
    let { startdate, finaldate } = req.query;
    startdate = startdate ? new Date(decodeURIComponent(startdate)) : null;
    finaldate = finaldate ? new Date(decodeURIComponent(finaldate)) : null;

    // Se as datas não forem válidas, definir valores padrão (2 meses atrás e 2 meses à frente)
    if (isNaN(startdate?.getTime())) {
      startdate = new Date();
      startdate.setMonth(startdate.getMonth() - 2);
    }
    if (isNaN(finaldate?.getTime())) {
      finaldate = new Date();
      finaldate.setMonth(finaldate.getMonth() + 2);
    }

    // Garantir que startDate seja menor que finalDate
    if (startdate > finaldate) {
      return res.status(400).json({ message: 'startDate deve ser anterior a finalDate.' });
    }

    const activities = await Activity.findAll({
      where: {
        userId: req.userId,
        activityType: ACTIVITY_TYPE[1], //'SPECIALIZED'
      },
      include: [
        {
          model: Priority,
          required: true,
          attributes: ['name'],
        },
        {
          model: Keyword,
          required: true,
          attributes: ['name', 'color'],
          through: { attributes: [] },
        },
        {
          model: Task,
          required: true,
          include: [
            { model: Step, required: false },
            {
              model: TaskInstance,
              required: true,
              where: {
                finalDate: {
                  [Op.between]: [startdate, finaldate],
                },
                currentState: {
                  [Op.in]: [
                    SPECIALIZATION_STATE[1], // 'TODO'
                    SPECIALIZATION_STATE[2], // 'TODO_LATE'
                    SPECIALIZATION_STATE[3], // 'WAITING'
                    SPECIALIZATION_STATE[4], // 'WAITING_LATE'
                    SPECIALIZATION_STATE[5], // 'DOING'
                    SPECIALIZATION_STATE[6], // 'DOING_LATE'
                    SPECIALIZATION_STATE[7], // 'COMPLETED'
                    SPECIALIZATION_STATE[8], // 'COMPLETED_LATE'
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
  const { state, priority, activitytype, keyword, areaoflife, searchtext } = req.query;

  const decodedPriority = priority ? decodeURIComponent(priority) : null;
  const decodedActivitytype = activitytype ? decodeURIComponent(activitytype) : null;
  const decodedAreaOfLife = areaoflife ? decodeURIComponent(areaoflife) : null;
  const decodedKeyword = keyword ? decodeURIComponent(keyword) : null;
  const decodedSearchText = searchtext ? decodeURIComponent(searchtext) : null;

  try {
    let filters = {};

    // Search State
    if (state) {
      const stateArray = state.split(',').map(s => s.toUpperCase());
      filters.currentState = stateArray;
    }

    // Search Activity Type
    if (state) {
      const activityTypeArray = decodedActivitytype.split(',').map(at => at.toUpperCase());
      filters.activitytype = activityTypeArray;
    }

    // Search Priority
    if (decodedPriority) {
      const foundPriorities = await Priority.findAll({
        attributes: ['id'],
        where: {
          name: decodedPriority.split(',').map(s => s.toUpperCase())
        }
      });
      if (foundPriorities) {
        filters.priorityId = foundPriorities.map(p => p.id);
      }
    }

    // Search Activity Type
    if (activitytype) {
      const activitytypeArray = activitytype.split(',').map(s => s.toUpperCase());
      filters.activityType = activitytypeArray;
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

    const include = [
      {
        model: Task,
        required: false,
        include: [
          {
            model: Step,
            required: false,
          }
        ],
      },
    ];

    const activities = await Activity.findAll({
      where: filters,
      // include: decodedActivitytype === 'TASK' ? include : []
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
  }
};

export const createActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const {
    title,
    description,
    keywords,
  } = req.body;

  try {
    const newActivity = await Activity.create({
      title: title,
      description: description,
      userId: req.userId
    });

    const keywordsFetched = await Keyword.findAll({
      where: { name: keywords }
    });

    await newActivity.setKeywords(keywordsFetched);

    res.status(201).json({
      message: 'Activity created successfully!',
      activity: newActivity,
    });
  }
  catch (err) {
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
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const updatedActivity = await Activity.findOne({
      where: {
        id: activityId,
        userId: req.userId,
      },
    });

    if (!updatedActivity || updatedActivity.activityState === 'SPECIALIZED') {
      return res.status(404).json({ message: 'Activity not found.' });
    };

    const updatedFields = {};
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;

    await updatedActivity.update(
      updatedFields,
      { transaction }
    );


    if (keywords) {
      const keywordsFetched = await Keyword.findAll({
        where: { name: keywords }
      });
      await updatedActivity.setKeywords(
        keywordsFetched,
        { transaction }
      );
    }


    if (importance) {
      const importanceFetched = await Importance.findOne({
        where: { name: importance }
      });
      await updatedActivity.setImportance(
        importanceFetched,
        { transaction }
      );
    };


    if (difficulty) {
      const difficultyFetched = await Difficulty.findOne({
        where: { name: difficulty }
      });
      await updatedActivity.setDifficulty(
        difficultyFetched,
        { transaction }
      );
    };

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