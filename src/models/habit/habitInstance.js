import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import HabitInstanceStatusHistory from './habitInstanceStatusHistory.js';

const HabitInstance = sequelize.define('habitInstance', {
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

HabitInstance.hasMany(HabitInstanceStatusHistory, { onDelete: 'CASCADE' });
HabitInstanceStatusHistory.belongsTo(HabitInstance, { allowNull: false });

export default HabitInstance;
