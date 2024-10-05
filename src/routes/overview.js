const express = require('express');

const router = express.Router();

const activityController = require('../controllers/activity')
const taskController = require('../controllers/task');



router.post('/add-activity', activityController.createActivity);

router.post('/add-task', taskController.createTask);

module.exports = router;