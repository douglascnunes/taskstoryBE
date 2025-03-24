const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Activity = require('../activity/activity.js');

const HabitLevel = require('./habitLevel.js');
const PhaseMultiplier = require('./phaseMultiplier.js');
const HabitPhaseMultiplier = require('./habitPhaseMultiplier.js');
const HabitPhase = require('./habitPhase.js');
const HabitInstance = require('./habitInstance.js');

const ENUM = require('../../util/enum.js');


const Habit = sequelize.define('habit', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  notificationType: {
    type: Sequelize.ENUM(ENUM.HABIT_NOTIFICATION_TYPE),
  allowNull: true,
  },
  notificationHours : {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  frequenceIntervalDays: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  frequenceWeeklyDays: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  goalType: {
    type: Sequelize.ENUM(ENUM.HABIT_GOAL_TYPE),
  allowNull: false,
  },
  goalDescription: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  currentExp: {
    type: Sequelize.INTEGER
  },
  noOverdueStreak: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});


Activity.hasOne(Habit, {onDelete: 'CASCADE'});
Habit.belongsTo(Activity, {allowNull: false});

Habit.belongsTo(HabitLevel, { foreignKey: 'currentLevel'});
HabitLevel.hasMany(Habit, { foreignKey: 'currentLevel'});

Habit.belongsTo(HabitPhase, { foreignKey: 'currentPhase', allowNull: true});
HabitPhase.hasMany(Habit, { foreignKey: 'currentPhase'});

Habit.belongsToMany(PhaseMultiplier, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });
PhaseMultiplier.belongsToMany(Habit, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });

Habit.hasMany(HabitPhase, {onDelete: 'CASCADE'});
HabitPhase.belongsTo(Habit, {allowNull: false });

Habit.hasMany(HabitInstance, {allowNull: false, onDelete: 'CASCADE'});
HabitInstance.belongsTo(Habit, {allowNull: false});


module.exports = Habit;
