import { Op } from "sequelize";
import Keyword from "../models/areaOfLife/keyword.js"
import { controllerErrorObj } from "../util/error.js";
import { validationResult as expValidatorRes } from 'express-validator';

export const getUserKeywords = async (req, res, next) => {
  try {
    const keywords = await Keyword.findAll({
      where: {
        userId: { [Op.or]: [req.userId, null] }
      },
    });

    res.status(200).json({
      message: 'Fetched User Keywords successfully.',
      keywords: keywords,
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

export const createKeyword = async (req, res, next) => {
  const errors = expValidatorRes(req);
  if (!errors.isEmpty()) {
    return next(controllerErrorObj('Validation failed, entered data is incorrect.', 422, errors));
  };

  const {
    name,
    colorAngle,
    areaOfLifeId
  } = req.body

  try {
    const newKeyword = await Keyword.create({
      name: name,
      colorAngle: colorAngle,
      areaOfLifeId: areaOfLifeId,
      userId: req.userId,
    });

    console.log('[CREATE] Keyword')
    res.status(201).json({
      message: 'Keyword created successfully!',
      activity: newKeyword,
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};