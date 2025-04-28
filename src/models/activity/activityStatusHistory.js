import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { ACTIVITY_TYPE } from '../../util/enum.js';

const ActivityStatusHistory = sequelize.define('activityStatusHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  status: {
    type: Sequelize.ENUM(ACTIVITY_TYPE),
    allowNull: false,
  },
});

export default ActivityStatusHistory;