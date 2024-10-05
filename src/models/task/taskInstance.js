const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const TaskInstanceStateHistory = require('./taskStateHistory.js')


const TaskInstance = sequelize.define('taskInstance', {
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
  stepCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {step1: boolean, step2: boolean, step3: boolean}
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
});


// Relacionamento entre TaskInstance e TaskInstanceStateHistory
TaskInstance.hasMany(TaskInstanceStateHistory, { foreignKey: 'taskInstanceId', onDelete: 'CASCADE' });
TaskInstanceStateHistory.belongsTo(TaskInstance, { foreignKey: 'taskInstanceId' });


module.exports = TaskInstance;
