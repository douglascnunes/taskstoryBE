import { where } from 'sequelize';
import User from '../models/user/user.js';
import * as errorHelper from '../util/error.js';
import { validationResult as expValidatorRes } from 'express-validator';
import UserLevel from '../models/user/userLevel.js';



export const getUser = async (req, res, next) => {

  try {
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ['name', 'email', 'avatar', 'currentLevelPoints', 'procrastinationType'],
      include: [
        {
          model: UserLevel,
          required: true,
          attributes: ['level', 'expRequiredToUp']
        }
      ]
    })

    console.log('[GET USER] Name:', user.name);

    res.status(200).json({
      message: 'Fetched User successfully.',
      user: user,
    });
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
}