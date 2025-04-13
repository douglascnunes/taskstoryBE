import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { ACTIVITY_TYPE } from '../../util/enum.js';

const ActivityStateHistory = sequelize.define('activityStateHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  state: {
    type: Sequelize.ENUM(ACTIVITY_TYPE),
    allowNull: false,
  },
});

export default ActivityStateHistory;