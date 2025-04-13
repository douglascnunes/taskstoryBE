import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import {INSTANCE_STATE } from '../../util/enum.js';

const GoalInstanceStateHistory = sequelize.define('goalInstanceStateHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  state: {
    type: Sequelize.ENUM(INSTANCE_STATE),
    allowNull: false,
  },
});

export default GoalInstanceStateHistory;