import express from 'express';
import { body } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as activityController from '../controllers/activity.js';
import { IMPORTANCE_NAME } from '../util/enum.js';

const router = express.Router();

router.get('/activities', isAuth, activityController.getFilteredActivities);

router.get('/overview', isAuth, activityController.getOverview);

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
        if (!IMPORTANCE_NAME.includes(value)) {
          throw new Error('Invalid importance value.');
        }
        return true;
      }),

    body('difficulty')
      .isString()
      .custom((value) => {
        if (!IMPORTANCE_NAME.includes(value)) {
          throw new Error('Invalid difficulty value.');
        }
        return true;
      }),
  ],
  activityController.createActivity
);


router.patch('/activities', isAuth,

  (req, res, next) => {
    const { title, description, keywords, importance, difficulty } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      keywords === undefined &&
      importance === undefined &&
      difficulty === undefined
    ) {
      return res.status(400).json({
        message: 'At least one field (title, description, keywords, importance, difficulty) must be provided for update.'
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
      .isArray().withMessage('Must be a array.'),

    body('importance')
      .optional()
      .isString()
      .custom((value) => {
        if (!IMPORTANCE_NAME.includes(value)) {
          throw new Error('Invalid importance value.');
        }
        return true;
      }),

    body('difficulty')
      .optional()
      .isString()
      .custom((value) => {
        if (!IMPORTANCE_NAME.includes(value)) {
          throw new Error('Invalid difficulty value.');
        }
        return true;
      }),
  ],
  activityController.updateActivity
);

export default router;