import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import TaskInstanceStatusHistory from './taskStatusHistory.js';
import { SPECIALIZATION_STATUS } from '../../util/enum.js';

const TaskInstance = sequelize.define('taskInstance', {
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
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

TaskInstance.hasMany(TaskInstanceStatusHistory, { onDelete: 'CASCADE' });
TaskInstanceStatusHistory.belongsTo(TaskInstance);

export default TaskInstance;
