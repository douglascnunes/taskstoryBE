import express from 'express';
import { getAllAreasOfLife } from '../controllers/areaOfLife.js';

const router = express.Router();

router.get('/areasoflife', getAllAreasOfLife);

export default router;