import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import Step from './step.js';
import TaskInstance from './taskInstance.js';

const Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  startPeriod: {
    type: Sequelize.DATE,
    allowNull: true
  },
  endPeriod: {
    type: Sequelize.DATE,
    allowNull: true
  },
  frequenceIntervalDays: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  frequenceWeeklyDays: {
    type: Sequelize.JSON,
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

Activity.hasOne(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Activity, { allowNull: false });

Task.hasMany(Step, { onDelete: 'CASCADE' });
Step.belongsTo(Task, { allowNull: false });

Task.hasMany(TaskInstance, { allowNull: false, onDelete: 'CASCADE' });
TaskInstance.belongsTo(Task, { allowNull: false });

export default Task;
