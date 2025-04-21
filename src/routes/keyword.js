import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { body } from 'express-validator';

import * as keywordController from '../controllers/keyword.js';

const router = express.Router();

router.get('/userkeywords', isAuth, keywordController.getUserKeywords);

router.post('/keywords', isAuth, [
  body('name', 'name is not valid.')
    .trim()
    .isString()
    .notEmpty()
    .isLength({ min: 3, max: 15 }),
  body('colorAngle', 'color is not valid.')
    .custom(value => {
      const v = parseInt(value, 10);
      const inFirstRange = v >= 0 && v <= 359;
      const inSecondRange = v >= 900 && v <= 1000;
      if (!inFirstRange && !inSecondRange) {
        throw new Error('colorAngle deve estar entre 0 a 359 ou 900 a1000');
      }
      return true;
    }),
  body('areaOfLifeId', 'AreaOfLife Id is not valid.')
    .isInt()
], keywordController.createKeyword);

export default router;