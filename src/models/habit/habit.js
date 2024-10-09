const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const Activity = require('../activity/activity.js');

const HabitLevel = require('./habitLevel');
const PhaseMultiplier = require('./phaseMultiplier');
const HabitPhaseMultiplier = require('./habitPhaseMultiplier');
const HabitPhase = require('./habitPhase.js');
const HabitInstance = require('./habitInstance');


const Habit = sequelize.define('habit', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  notificationType: {
    type: Sequelize.ENUM(
    'HORAS_ANTES',
    'NO_LOGIN',
    'DESLIGADO',
    ),
  allowNull: false,
  },
  notificationHours : {
    type: Sequelize.INTEGER
  },
  frequenceIntervalDays: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  frequenceWeeklyDays: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  goalType: {
    type: Sequelize.ENUM(
    'QUANTIDADE_MINIMA_PERIODO',
    'SEQUENCIA_SUCESSO',
    'VALOR_MEDIO_PERIODO'
    ),
  allowNull: false,
  },
  goalDescription: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  initialGoalCountDay: {
    type: Sequelize.DATE,
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

Habit.belongsToMany(PhaseMultiplier, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });
PhaseMultiplier.belongsToMany(Habit, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });

Habit.hasMany(HabitPhase, {onDelete: 'CASCADE'});
HabitPhase.belongsTo(Habit, {allowNull: false });

Habit.hasMany(HabitInstance, {allowNull: false, onDelete: 'CASCADE'});
HabitInstance.belongsTo(Habit, {allowNull: false});


module.exports = Habit;
