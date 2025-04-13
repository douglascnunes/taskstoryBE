import express from 'express';
import { body } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as habitController from '../controllers/habit.js';
import { HABIT_GOAL_TYPE } from '../util/enum.js';

const router = express.Router();

router.post('/habits', isAuth,
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Title cannot be empty.')
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters.'),
    body('keywords')
      .isArray({ min: 1 }).withMessage('Must select at least 1 keyword.'),
    body('frequenceIntervalDays')
      .optional()
      .isInt(),
    body('frequenceWeeklyDays')
      .optional()
      .isString(),
    body()
      .custom((value, { req }) => {
        const frequenceIntervalDays = req.body.frequenceIntervalDays;
        const frequenceWeeklyDays = req.body.frequenceWeeklyDays;

        if (!!frequenceIntervalDays === !!frequenceWeeklyDays) {
          throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
        }
        return true;
      }),
    body('notificationType')
      .optional()
      .isString(),
    body('notificationHours')
      .optional()
      .isInt(),
    body('goalType')
      .isString()
      .custom(value => HABIT_GOAL_TYPE.includes(value))
      .withMessage(`goalType must be one of the following: ${HABIT_GOAL_TYPE.join(', ')}.`),
    body('goalDescription')
      .isString(),
    body('goalValueI')
      .isInt(),
    body('goalValueF')
      .optional()
      .isInt()
      .withMessage('goalCount must be an integer.')
      .custom((value, { req }) => {
        if (req.body.goalType === HABIT_GOAL_TYPE[0] && value !== null) {
          throw new Error(`goalCount must be null for goalType ${HABIT_GOAL_TYPE[0]}.`);
        }
        if (req.body.goalType !== HABIT_GOAL_TYPE[0] && value === null) {
          throw new Error(`goalCount cannot be null for goalType other than ${HABIT_GOAL_TYPE[0]}.`);
        }
        return true;
      }),
  ],
  habitController.createHabit
);

export default router;