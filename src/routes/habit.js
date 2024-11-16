const express = require('express');
const expValidator = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const habitController = require('../controllers/habit');

const ENUM = require('../util/enum.js');


router.post('/habits', isAuth,
  [
    expValidator.body('title')
      .trim()
      .notEmpty().withMessage('Title cannot be empty.')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),

    expValidator.body('description')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters.'),

    expValidator.body('keywords')
      .isArray({ min: 1 }).withMessage('Must select at least 1 keyword.'),

    expValidator.body('frequenceIntervalDays')
      .optional()
      .isInt(),

    expValidator.body('frequenceWeeklyDays')
      .optional()
      .isString(),

    expValidator.body()
      .custom((value, { req }) => {
        const frequenceIntervalDays = req.body.frequenceIntervalDays;
        const frequenceWeeklyDays = req.body.frequenceWeeklyDays;

        if (!!frequenceIntervalDays === !!frequenceWeeklyDays) {
          throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
        }
        return true;
      }),

    expValidator.body('notificationType')
      .optional()
      .isString(),

    expValidator.body('notificationHours')
      .optional()
      .isInt(),

    expValidator.body('goalType')
      .isString(),

    expValidator.body('goalType')
      .isString()
      .custom(value => ENUM.HABIT_GOAL_TYPE.includes(value))
      .withMessage(`goalType must be one of the following: ${ENUM.HABIT_GOAL_TYPE.join(', ')}.`),

    expValidator.body('goalDescription')
      .isString(),

    expValidator.body('goalValueI')
      .isInt(),

    expValidator.body('goalValueF')
      .optional()
      .isInt()
      .withMessage('goalCount must be an integer.')
      .custom((value, { req }) => {
        if (req.body.goalType === ENUM.HABIT_GOAL_TYPE[0] && value !== null) {
          throw new Error(`goalCount must be null fo goalType ${ENUM.HABIT_GOAL_TYPE[0]}.`);
        }
        if (req.body.goalType !== ENUM.HABIT_GOAL_TYPE[0] && value === null) {
          throw new Error(`goalCount cannot be null for goalType other than ${ENUM.HABIT_GOAL_TYPE[0]}.`);
        }
        return true;
      }),

  ],
  habitController.createHabit);



module.exports = router;