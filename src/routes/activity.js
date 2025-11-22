import express from 'express';
import { body, param } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as activityController from '../controllers/activity.js';
import { DIFFICULTY_NAMES, IMPORTANCE_NAMES } from '../util/enum.js';

const router = express.Router();

router.get('/overview', isAuth, activityController.getOverview);

router.get('/activities/:id', isAuth, activityController.getActivity);

router.post('/activities', isAuth,
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

    body('createdAt')
      .notEmpty()
      .isISO8601().withMessage('Invalid date format for createdAt.'),
  ],
  activityController.createActivity
);


router.patch('/activities/:id', isAuth,

  (req, res, next) => {
    const { title, description, keywords, importance, difficulty } = req.body;

    if (
      !title && !description && !keywords && !importance && !difficulty) {
      return res.status(400).json({
        message: 'At least one field (title, description, keywords, importance, difficulty or steps) must be provided for update.'
      });
    }
    next();
  },

  [
    body('activityId')
      .notEmpty().withMessage('Activity ID cannot be empty.')
      .isInt().withMessage('Activity ID must be a number.'),

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
      .isArray().withMessage('Keywords must be a array.'),

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
  ],
  activityController.updateActivity
);

router.post('/activities/:id/dependencies', isAuth,
  [
    param('id')
      .notEmpty().withMessage('Activity ID (param) is required.')
      .isInt().withMessage('Activity ID must be an integer.'),
    body('dependencies')
      .optional()
      .isArray().withMessage('Dependencies must be an array.'),
  ],
  activityController.upsertDependencies
);

export default router;