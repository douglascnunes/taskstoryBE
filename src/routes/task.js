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

    body('initialDate')
      .optional()
      .isDate(),

    body('finalDate')
      .optional()
      .isDate(),

    body('frequenceIntervalDays')
      .optional()
      .isInt(),

    body('frequenceWeeklyDays')
      .optional()
      .isString(),

    body('steps')
      .optional()
      .isArray(),

    body()
      .custom((value, { req }) => {
        if (!req.body.finalDate && !frequenceIntervalDays && !frequenceWeeklyDays) {
          throw new Error('FinalDate, frequenceIntervalDays or frequenceWeeklyDays must be provided.');
        }
        else if (!!frequenceIntervalDays === !!frequenceWeeklyDays) {
          throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
        };

        return true;
      }),
  ],
  taskController.createTask
);

export default router;