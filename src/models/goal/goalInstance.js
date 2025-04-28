import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import GoalInstanceStatusHistory from './goalInstanceStatusHistory.js';
import { SPECIALIZATION_STATUS } from '../../util/enum.js';

const GoalInstance = sequelize.define('goalInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentStatus: {
    type: Sequelize.ENUM(SPECIALIZATION_STATUS),
    allowNull: false,
    defaultValue: SPECIALIZATION_STATUS[0],
  },
  initialDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  challengeCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {challenge1: {count: integer, isDone: boolean}, challenge1: {count: integer, isDone: boolean}}
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

GoalInstance.hasMany(GoalInstanceStatusHistory, { onDelete: 'CASCADE' });
GoalInstanceStatusHistory.belongsTo(GoalInstance);

export default GoalInstance;
