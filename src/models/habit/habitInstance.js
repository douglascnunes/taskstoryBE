import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import HabitInstanceStateHistory from './habitInstanceStateHistory.js';
import { SPECIALIZATION_STATE } from '../../util/enum.js';

const HabitInstance = sequelize.define('habitInstance', {
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
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  goalInstanceCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

HabitInstance.hasMany(HabitInstanceStateHistory, { onDelete: 'CASCADE' });
HabitInstanceStateHistory.belongsTo(HabitInstance, { allowNull: false });

export default HabitInstance;
