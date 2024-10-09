const Activity = require('../models/activity/activity.js');
const Task = require('../models/task/task.js')
const Project = require('../models/project/project.js')
const Habit = require('../models/habit/habit.js')
const Goal = require('../models/goal/goal.js')
const Planning = require('../models/planning/planning.js')
const AreaOfLife = require('../models/areaOfLife/areaOfLife.js')
const user = require('../models/user/user.js');
const GamificationComponent = require('../models/gamification/gamificationComponent.js');
const Trophy = require('../models/gamification/trophy.js');
const Medal = require('../models/gamification/medal.js');
const Mission = require('../models/gamification/mission.js');
const Item = require('../models/gamification/item.js');
const MedalTierList = require('../models/gamification/medalTierList.js');




exports.createActivity = (req, res, next) => {
  const { title, description, activityType } = req.body;

  Activity.create({
    title: title,
    description: description,
    activityType: activityType
  })
    .then(activity => {
      res.status(201).json({ message: 'Activity created successfully!', activity: activity });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create activity', error: err });
    });
};
