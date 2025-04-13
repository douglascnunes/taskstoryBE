import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import GoalInstanceStateHistory from './goalInstanceStateHistory.js';
import { SPECIALIZATION_STATE } from '../../util/enum.js';

const GoalInstance = sequelize.define('goalInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentState: {
    type: Sequelize.ENUM(SPECIALIZATION_STATE),
    allowNull: false,
    defaultValue: SPECIALIZATION_STATE[0],
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

GoalInstance.hasMany(GoalInstanceStateHistory, { onDelete: 'CASCADE' });
GoalInstanceStateHistory.belongsTo(GoalInstance);

export default GoalInstance;
