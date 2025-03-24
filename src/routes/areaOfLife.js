const express = require('express');

const areaOfLifeController = require('../controllers/areaOfLife');

const router = express.Router();

router.get('/areasoflife', areaOfLifeController.getAllAreasOfLife)

module.exports = router;