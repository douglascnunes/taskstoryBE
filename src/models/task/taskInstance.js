import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import TaskInstanceStateHistory from './taskStateHistory.js';
import {SPECIALIZATION_STATE} from '../../util/enum.js';

const TaskInstance = sequelize.define('taskInstance', {
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
  completedOn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  stepCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {step1: boolean, step2: boolean, step3: boolean}
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

TaskInstance.hasMany(TaskInstanceStateHistory, { onDelete: 'CASCADE' });
TaskInstanceStateHistory.belongsTo(TaskInstance);

export default TaskInstance;
