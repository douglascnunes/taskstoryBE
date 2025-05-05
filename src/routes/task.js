import express from 'express';
import { body } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as taskController from '../controllers/task.js';
import { DIFFICULTY_NAMES, IMPORTANCE_NAMES } from '../util/enum.js';

const router = express.Router();


router.post('/tasks', isAuth,
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

    body('createdAt')
      .notEmpty()
      .isISO8601().withMessage('Invalid date format for createdAt.'),

    body('importance')
      .isString()
      .custom((value) => {
        if (!IMPORTANCE_NAMES.includes(value)) {
          throw new Error('Invalid importance value.');
        }
        return true;
      }),

    body('difficulty')
      .isString()
      .custom((value) => {
        if (!DIFFICULTY_NAMES.includes(value)) {
          throw new Error('Invalid difficulty value.');
        }
        return true;
      }),

    body('startPeriod')
      .optional()
      .isISO8601().withMessage('Invalid date format for startPeriod.'),

    body('endPeriod')
      .optional()
      .isISO8601().withMessage('Invalid date format for endPeriod.'),

    body('frequenceIntervalDays')
      .optional()
      .isInt(),

    body('frequenceWeeklyDays')
      .optional()
      .isArray().withMessage('frequenceWeeklyDays must be an array.')
      .custom((arr) => {
        const isValid = Array.isArray(arr) && arr.every(num =>
          Number.isInteger(num) && num >= 0 && num <= 6
        );
        if (!isValid) throw new Error('frequenceWeeklyDays must contain only integers from 0 to 6.');
        return true;
      }),

    body('steps')
      .optional()
      .isArray(),

    body()
      .custom((value, { req }) => {
        if (!req.body.endPeriod && !req.body.frequenceIntervalDays && !req.body.frequenceWeeklyDays) {
          throw new Error('endPeriod, frequenceIntervalDays or frequenceWeeklyDays must be provided.');
        }
        else if (!!req.body.frequenceIntervalDays && !!req.body.frequenceWeeklyDays) {
          throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
        };

        return true;
      }),
  ],
  taskController.createTask
);

export default router;