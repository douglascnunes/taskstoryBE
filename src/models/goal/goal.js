const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');

const Activity = require('../activity/activity.js');

const Challenge = require('./challenge.js');
const GoalInstance = require('./goalInstance.js');


const Goal = sequelize.define('goal', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
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
});


Activity.hasOne(Goal, {onDelete: 'CASCADE'});
Goal.belongsTo(Activity, {allowNull: false});

Goal.hasMany(Challenge, {onDelete: 'CASCADE'});
Challenge.belongsTo(Goal, {allowNull: false});

Goal.hasMany(GoalInstance, {allowNull: false, onDelete: 'CASCADE'});
GoalInstance.belongsTo(Goal, {allowNull: false});


module.exports = Goal;
