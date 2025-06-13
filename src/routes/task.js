import express from 'express';
import { body, check, param } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as taskController from '../controllers/task.js';
import { DIFFICULTY_NAMES, IMPORTANCE_NAMES, INSTANCE_STATUS } from '../util/enum.js';

const router = express.Router();

router.get('/tasks/:activityid/', isAuth, taskController.getTask);

router.get('/tasks/:activityid/:instanceid', isAuth, taskController.getTaskInstance);

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


router.patch('/tasks/:id', isAuth,
  (req, res, next) => {
    const { title, description, keywords, importance, difficulty, task } = req.body;

    if (
      !title && !description && !keywords && !importance && !difficulty &&
      !task.startPeriod && !task.endPeriod && !task.frequenceIntervalDays && !task.frequenceWeeklyDays &&
      !task.steps) {
      return res.status(400).json({
        message: 'At least one field (title, description, keywords, importance, difficulty, startPeriod, endPeriod, frequenceIntervalDays, frequenceWeeklyDays or steps) must be provided for update.'
      });
    }
    next();
  },
  [
    param('id')
      .notEmpty().withMessage('Activity ID (param) is required.')
      .isInt().withMessage('Activity ID must be an integer.'),

    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Description cannot exceed 255 characters.'),

    body('keywords')
      .optional()
      .isArray({ min: 1 }).withMessage('Must select at least 1 keyword.'),

    body('importance')
      .optional()
      .isString()
      .custom((value) => {
        if (!IMPORTANCE_NAMES.includes(value)) {
          throw new Error('Invalid importance value.');
        }
        return true;
      }),

    body('difficulty')
      .optional()
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
      .isInt().withMessage('frequenceIntervalDays must be an integer.'),

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

    body().custom((value, { req }) => {
      if (!req.body.endPeriod && !req.body.frequenceIntervalDays && !req.body.frequenceWeeklyDays.length > 0) {
        throw new Error('endPeriod, frequenceIntervalDays or frequenceWeeklyDays must be provided.');
      };
      if (!!req.body.frequenceIntervalDays && !!req.body.frequenceWeeklyDays) {
        throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
      };

      return true;
    }),
  ],
  taskController.updateTask
);



router.post('/tasks/:id/steps', isAuth,
  [
    param('id')
      .notEmpty().withMessage('Activity ID (param) is required.')
      .isInt().withMessage('Activity ID must be an integer.'),

    body('steps')
      .optional()
      .isArray().withMessage('Steps must be an array.'),
  ],
  taskController.upsertSteps
);


router.post('/tasks/:id/instance', isAuth,
  [
    param('id')
      .notEmpty().withMessage('Activity ID (param) is required.')
      .isInt().withMessage('Activity ID must be an integer.'),

    body('finalDate')
      .isISO8601().withMessage('Invalid date format for finalDate.'),

    body('completedOn')
      .optional({ nullable: true })
      .isISO8601().withMessage('Invalid date format for completedOn.'),

    body('status')
      .optional()
      .isString()
      .custom((value) => {
        if (!INSTANCE_STATUS.includes(value)) {
          throw new Error('Invalid status value.');
        }
        return true;
      }),

    body('stepCompletionStatus')
      .optional()
      .isArray().withMessage('stepCompletionStatus must be an array.')
      .custom((arr) => {
        const isValid = Array.isArray(arr) && arr.every(num =>
          Number.isInteger(num));
        if (!isValid) throw new Error('stepCompletionStatus must contain only integers.');
        return true;
      }),

    check().custom((value, { req }) => {
      const { completedOn, status, stepCompletionStatus } = req.body;

      const atLeastOnePresent =
        completedOn !== undefined ||
        status !== undefined ||
        stepCompletionStatus !== undefined;

      if (!atLeastOnePresent) {
        throw new Error('At least one of completedOn, status, or stepCompletionStatus must be provided.');
      }
      return true;
    }),
  ], taskController.createInstance
);



router.patch('/tasks/:taskid/instance/:instanceid', isAuth,
  [
    param('taskid')
      .notEmpty().withMessage('Task ID (param) is required.')
      .isInt().withMessage('Task ID must be an integer.'),

    param('instanceid')
      .notEmpty().withMessage('Instance ID (param) is required.')
      .isInt().withMessage('Instance ID must be an integer.'),

    // body('finalDate')
    //   .optional()
    //   .isISO8601().withMessage('Invalid date format for finalDate.'),

    body('completedOn')
      .optional({ nullable: true })
      .isISO8601().withMessage('Invalid date format for completedOn.'),

    body('status')
      .optional()
      .isString()
      .custom((value) => {
        if (!INSTANCE_STATUS.includes(value)) {
          throw new Error('Invalid status value.');
        }
        return true;
      }),

    body('stepCompletionStatus')
      .optional()
      .isArray().withMessage('stepCompletionStatus must be an array.')
      .custom((arr) => {
        const isValid = Array.isArray(arr) && arr.every(num =>
          Number.isInteger(num));
        if (!isValid) throw new Error('stepCompletionStatus must contain only integers.');
        return true;
      }),

    check().custom((value, { req }) => {
      const { finalDate, completedOn, status, stepCompletionStatus } = req.body;

      const atLeastOnePresent =
        finalDate !== undefined ||
        completedOn !== undefined ||
        status !== undefined ||
        stepCompletionStatus !== undefined;

      if (!atLeastOnePresent) {
        throw new Error('At least one of finalDate, completedOn, status, or stepCompletionStatus must be provided.');
      }
      return true;
    }),
  ], taskController.updateInstance
);


export default router;