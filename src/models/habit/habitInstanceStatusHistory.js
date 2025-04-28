import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { INSTANCE_STATUS } from '../../util/enum.js';

const HabitInstanceStatusHistory = sequelize.define('habitInstanceStatusHistory', {
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

export default HabitInstanceStatusHistory;