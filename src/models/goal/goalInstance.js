const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const GoalInstanceStateHistory = require('./goalStateHistory.js')


const GoalInstance = sequelize.define('goalInstance', {
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
  initialDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  challengeCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {challenge1: {count: integer, isDone: boolean}, challenge1: {count: integer, isDone: boolean}}
  },
});


GoalInstance.hasMany(GoalInstanceStateHistory, { onDelete: 'CASCADE' });
GoalInstanceStateHistory.belongsTo(GoalInstance);


module.exports = GoalInstance;
