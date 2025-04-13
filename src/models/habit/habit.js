import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import HabitLevel from './habitLevel.js';
import PhaseMultiplier from './phaseMultiplier.js';
import HabitPhaseMultiplier from './habitPhaseMultiplier.js';
import HabitPhase from './habitPhase.js';
import HabitInstance from './habitInstance.js';
import { HABIT_NOTIFICATION_TYPE, HABIT_GOAL_TYPE } from '../../util/enum.js';

const Habit = sequelize.define('habit', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  notificationType: {
    type: Sequelize.ENUM(HABIT_NOTIFICATION_TYPE),
    allowNull: true,
  },
  notificationHours: {
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
    type: Sequelize.ENUM(HABIT_GOAL_TYPE),
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

Activity.hasOne(Habit, { onDelete: 'CASCADE' });
Habit.belongsTo(Activity, { allowNull: false });

Habit.belongsTo(HabitLevel, { foreignKey: 'currentLevel' });
HabitLevel.hasMany(Habit, { foreignKey: 'currentLevel' });

Habit.belongsTo(HabitPhase, { foreignKey: 'currentPhase', allowNull: true });
HabitPhase.hasMany(Habit, { foreignKey: 'currentPhase' });

Habit.belongsToMany(PhaseMultiplier, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });
PhaseMultiplier.belongsToMany(Habit, { through: HabitPhaseMultiplier, onDelete: 'CASCADE' });

Habit.hasMany(HabitPhase, { onDelete: 'CASCADE' });
HabitPhase.belongsTo(Habit, { allowNull: false });

Habit.hasMany(HabitInstance, { allowNull: false, onDelete: 'CASCADE' });
HabitInstance.belongsTo(Habit, { allowNull: false });

export default Habit;
