import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import Challenge from './challenge.js';
import GoalInstance from './goalInstance.js';

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
    type: Sequelize.INTEGER,
    allowNull: true
  },
  frequenceWeeklyDays: {
    type: Sequelize.STRING,
    allowNull: true
  },
});

Activity.hasOne(Goal, { onDelete: 'CASCADE' });
Goal.belongsTo(Activity, { allowNull: false });

Goal.hasMany(Challenge, { onDelete: 'CASCADE' });
Challenge.belongsTo(Goal, { allowNull: false });

Goal.hasMany(GoalInstance, { allowNull: false, onDelete: 'CASCADE' });
GoalInstance.belongsTo(Goal, { allowNull: false });

export default Goal;
