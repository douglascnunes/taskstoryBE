const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const HabitInstanceStateHistory = require('./habitInstanceStateHistory.js')

const ENUM = require('../../util/enum.js');


const HabitInstance = sequelize.define('habitInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentState: {
    type: Sequelize.ENUM(ENUM.SPECIALIZATION_STATE),
    allowNull: false,
    defaultValue: ENUM.SPECIALIZATION_STATE[0],
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
HabitInstanceStateHistory.belongsTo(HabitInstance, {allowNull: false });


module.exports = HabitInstance;
