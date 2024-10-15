const { Op } = require('sequelize');

const expValidatorRes = require('express-validator').validationResult;

const errorHelper = require('../util/error.js');

const Activity = require('../models/activity/activity.js');
const AreaOfLife = require('../models/areaOfLife/areaOfLife.js');
const Keyword = require('../models/areaOfLife/keyword.js');



exports.createActivity = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(errorHelper.controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  }
  
  const { title, description, keywords} = req.body;

  try {
    const newActivity = await Activity.create({
      title: title, 
      description: description,
      userId: req.userId
    });

    const keywordsFetched = await Keyword.findAll({
      where: {id: keywords}
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
  const userId = req.userId;
  const { state, priority, type, keyword, areaoflife } = req.query;

  let filters = {};


  if (state) {
    filters.currentState = state.split(',').map(s => s.toUpperCase());
  } else {
    filters.currentState = ['AFAZER', 'FAZENDO', 'AGUARDANDO', 'ATRASADA'];
  };
  if (priority) {
    filters.priority = priority.split(',');
  };
  if (type) {
    filters.type = type.split(',');
  };

  try {
    if (areaoflife) {
      const areaOfLifeNames = areaoflife.split(',');
      filters.areaOfLife = await AreaOfLife.findAll({
        attributes: ['id'],
        where: {name: areaOfLifeNames}
      });
    };
    if (keyword) {
      const keywordNames = keyword.split(',');
      filters.keyword = await Keyword.findAll({
        attributes: ['id'],
        where: {[Op.or]: [{name: keywordNames}, {areaOfLifeId: filters.areaOfLife}]},
      });
    };
  
    const activities = await Activity.findAll({
      where: {
        userId: userId,
        ...filters
      }
    })

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
