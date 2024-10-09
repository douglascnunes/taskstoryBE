const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Activity = require('../activity/activity.js');

const Step = require('./step');
const TaskInstance = require('./taskInstance');


const Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  initialDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  frequenceIntervalDays: {
    type: Sequelize.STRING,
    allowNull: true
  },
  frequenceWeeklyDays: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  instanceStrikeRecord: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  noOverdueStreak: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});


Activity.hasOne(Task, {onDelete: 'CASCADE'});
Task.belongsTo(Activity, {allowNull: false});

Task.hasMany(Step, {onDelete: 'CASCADE'});
Step.belongsTo(Task, {allowNull: false});

Task.hasMany(TaskInstance, {allowNull: false, onDelete: 'CASCADE'});
TaskInstance.belongsTo(Task, {allowNull: false});


module.exports = Task;
