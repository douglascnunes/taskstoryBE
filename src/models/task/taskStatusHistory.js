import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { INSTANCE_STATUS } from '../../util/enum.js';

const TaskInstanceStatusHistory = sequelize.define('taskInstanceStatusHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  status: {
    type: Sequelize.ENUM(INSTANCE_STATUS),
    allowNull: false,
  },
});

export default TaskInstanceStatusHistory;