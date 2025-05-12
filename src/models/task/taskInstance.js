import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import TaskInstanceStatusHistory from './taskStatusHistory.js';
import { INSTANCE_STATUS } from '../../util/enum.js';
import User from '../user/user.js';

const TaskInstance = sequelize.define('taskInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  completedOn: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM(INSTANCE_STATUS),
    allowNull: false,
    defaultValue: INSTANCE_STATUS[0], // ACTIVE
  },
  stepCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  // priorityEvolved: {
  //   type: Sequelize.BOOLEAN,
  //   allowNull: false,
  // },
},
  { timestamps: false }
);

TaskInstance.hasMany(TaskInstanceStatusHistory, { onDelete: 'CASCADE' });
TaskInstanceStatusHistory.belongsTo(TaskInstance);

User.hasMany(TaskInstance, { onDelete: 'CASCADE' });
TaskInstance.belongsTo(User, { allowNull: false });

export default TaskInstance;
