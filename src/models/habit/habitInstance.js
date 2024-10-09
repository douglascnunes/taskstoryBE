const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const HabitInstanceStateHistory = require('./habitInstanceStateHistory.js')


const HabitInstance = sequelize.define('habitInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentState: {
    type: Sequelize.ENUM(
      'A_FAZER',
      'FAZENDO',
      'AGUARDANDO',
      'CONCLUIDA',
      'CONCLUIDA_ATRASADA', 
      'ATRASADA',
      'EXCLUIDA',
      'PAUSADA'
    ),
    allowNull: false,
    defaultValue: 'A_FAZER',
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
