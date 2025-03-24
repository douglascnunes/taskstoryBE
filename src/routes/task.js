const express = require('express');
const expValidator = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const taskController = require('../controllers/task');


router.post('/tasks', isAuth,
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

    expValidator.body('initialDate')
      .optional()
      .isDate(),

    expValidator.body('finalDate')
      .optional()
      .isDate(),

    expValidator.body('frequenceIntervalDays')
      .optional()
      .isInt(),

    expValidator.body('frequenceWeeklyDays')
      .optional()
      .isString(),

    expValidator.body('steps')
      .optional()
      .isArray(),

    expValidator.body()
      .custom((value, { req }) => {
        const frequenceIntervalDays = req.body.frequenceIntervalDays;
        const frequenceWeeklyDays = req.body.frequenceWeeklyDays;

        if (!!frequenceIntervalDays === !!frequenceWeeklyDays) {
          throw new Error('Either "frequenceIntervalDays" or "frequenceWeeklyDays" must be provided, but not both.');
        }
        return true;
      }),
  ],
  taskController.createTask);



module.exports = router;