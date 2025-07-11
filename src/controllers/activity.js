import { Op, Sequelize } from 'sequelize';
import { validationResult as expValidatorRes } from 'express-validator';

import sequelize from '../util/db.js';
import { controllerErrorObj } from '../util/error.js';
import { ACTIVITY_TYPE, POINTS, PRIORITY_VALUES } from '../util/enum.js';

import Activity from '../models/activity/activity.js';
import AreaOfLife from '../models/areaOfLife/areaOfLife.js';
import Keyword from '../models/areaOfLife/keyword.js';
import ActivityKeyword from '../models/activity/activityKeyword.js';
import Task from '../models/task/task.js';
import Step from '../models/task/step.js';
import TaskInstance from '../models/task/taskInstance.js';
import { getTaskPeriodFilter } from '../util/helpers/controller-task.js';
import { applyUserPoints } from '../util/helpers/controller-user.js';
import { calculateKeywordPoints, updateActivityKeywords } from '../util/helpers/controller-keyword.js';
import { buildActivityUpdateData } from '../util/helpers/controller-activity.js';



export const getOverview = async (req, res, next) => {
  const { condiction, type, keyword, areaoflife, searchtext, priority, startdate, finaldate } = req.query;

  const decodedType = type ? decodeURIComponent(type) : null;
  const decodedAreaOfLife = areaoflife ? decodeURIComponent(areaoflife) : null;
  const decodedKeyword = keyword ? decodeURIComponent(keyword) : null;
  const decodedSearchText = searchtext ? decodeURIComponent(searchtext) : null;
  const decodedPriority = priority ? decodeURIComponent(priority) : null;
  const decodedStartDate = startdate ? decodeURIComponent(startdate) : null;
  const decodedFinalDate = finaldate ? decodeURIComponent(finaldate) : null;

  try {
    let filters = {};

    // Start and End Overview limits
    let startdateDate = decodedStartDate ? new Date(decodeURIComponent(decodedStartDate)) : null;
    let finaldateDate = decodedFinalDate ? new Date(decodeURIComponent(decodedFinalDate)) : null;
    console.log('startdate', startdateDate)
    console.log('finaldateDate', finaldateDate)

    if (!startdateDate) {
      startdateDate = new Date();
      startdateDate.setMonth(startdateDate.getMonth() - 2);
    }
    if (!finaldateDate) {
      finaldateDate = new Date();
      finaldateDate.setMonth(finaldateDate.getMonth() + 2);
    }
    if (startdateDate > finaldateDate) {
      return res.status(400).json({ message: 'startDate deve ser anterior a finalDate.' });
    }


    // Search Status
    if (condiction) {
      const condictionArray = condiction.split(',').map(s => s.toUpperCase());
      // filters.currentCondiction = condictionArray;
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

    console.log('filter', filters)

    const activities = await Activity.findAll({
      where: {
        ...(Object.keys(filters).length > 0 && filters),
        userId: req.userId,
        type: ACTIVITY_TYPE[1], //'SPECIALIZED'
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
          attributes: [
            'id', 'startPeriod', 'endPeriod', 'frequenceIntervalDays', 'frequenceWeeklyDays', 'deletedInstances'
          ],
          where: getTaskPeriodFilter(startdateDate, finaldateDate),
          include: [
            { model: Step, required: false },
            {
              model: TaskInstance,
              required: false,
              where: {
                finalDate: {
                  [Op.between]: [startdateDate, finaldateDate],
                },
                status: 'ACTIVE',
              },
            },
          ]
        },
      ]
    }
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




export const getActivity = async (req, res, next) => {
  const { id } = req.params;
  const { instance } = req.query;

  try {
    const activity = await Activity.findOne({
      where: {
        id: id,
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
          required: false,
          include: [
            {
              model: Step,
              required: false,
              attributes: ['id', 'description'],
            },
            ...(instance
              ? [{
                model: TaskInstance,
                required: false,
                where: { id: instance },
              }]
              : [])
          ],
        },
      ],
    });

    console.log('[GET ACTIVITY] Activity title: ' + activity.title);
    res.status(200).json({
      message: 'Fetched Activities successfully.',
      activity: activity
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

  const { keywords, ...rest } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    const newActivity = await Activity.create({
      title: rest.title,
      description: rest.description ?? null,
      importance: rest.importance,
      difficulty: rest.difficulty,
      createdAt: rest.createdAt,
      userId: req.userId
    }, { transaction });

    points += POINTS.ACTIVITY.CREATE;
    if (rest.description) points += POINTS.ACTIVITY.DESCRIPTION;

    const { oldKeywords, newKeywords } = await updateActivityKeywords({
      activity: newActivity,
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

    await applyUserPoints({ userId: req.userId, points, transaction });

    await transaction.commit();

    console.log('[CREATE ACTIVITY] title:' + newActivity.title + ', Points:' + points);

    res.status(201).json({
      message: 'Activity created successfully!',
      activity: newActivity,
    });
  } catch (err) {
    await transaction.rollback();
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};



export const updateActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }

  const { activityId, keywords, ...rest } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let points = 0;

    const activity = await Activity.findOne({
      where: { id: activityId, userId: req.userId, },
    });

    if (!activity || activity.status === 'SPECIALIZED') {
      return res.status(404).json({ message: 'Activity not found.' });
    };

    // ATUALIZAÇÃO DOS ATRIBUTOS DA ATIVIDADE
    if (rest.description && !activity.description) points += POINTS.ACTIVITY.DESCRIPTION;
    const activityUpdateData = buildActivityUpdateData(rest, req.userId);
    Object.assign(activity, activityUpdateData);
    await activity.save({ transaction });

    // ATUALIZAÇÃO DAS PALAVRAS-CHAVE
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

    await applyUserPoints({ userId: req.userId, points, transaction, });

    await transaction.commit();

    console.log('[UPDATE ACTIVITY] title: ' + updatedActivity.title + ', Points: ' + points);

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