const express = require('express');
const expValidator = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/isAuth');

const activityController = require('../controllers/activity');


router.post('/activities', isAuth, 
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
      .isArray({ min: 1 }).withMessage('Must select at least 1 keyword.')
      .custom((value) => {
        const areValidIds = value.every(Number.isInteger);
        if (!areValidIds) {
          throw new Error('All keywords must be valid integer IDs.');
        }
        return true;
      }),
    ],
  activityController.createActivity);

  
router.get('/activities', isAuth, activityController.getFilteredOverview);


module.exports = router;