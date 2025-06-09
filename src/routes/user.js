import express from 'express';
import { body } from 'express-validator';

import isAuth from '../middleware/isAuth.js';
import * as userController from '../controllers/user.js';


const router = express.Router();

router.get('/user', isAuth, userController.getUser);

export default router;