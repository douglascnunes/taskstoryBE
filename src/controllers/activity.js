const { Op } = require('sequelize');

const expValidatorRes = require('express-validator').validationResult;

const errorHelper = require('../util/error.js');

const Activity = require('../models/activity/activity.js');
const AreaOfLife = require('../models/areaOfLife/areaOfLife.js');
const Keyword = require('../models/areaOfLife/keyword.js');
const Priority = require('../models/activity/priority.js');
const ActivityKeyword = require('../models/activity/activityKeyword.js');



exports.createActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
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
}



exports.getFilteredOverview = async (req, res, next) => {
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
      include: decodedActivitytype === 'TASK' ? include : []
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
