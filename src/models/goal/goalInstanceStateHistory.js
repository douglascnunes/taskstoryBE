const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const GoalInstanceStateHistory = sequelize.define('goalInstanceStateHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  state: {
    type: Sequelize.ENUM(
      'LIXO', 
      'REFERENCIA', 
      'INCUBACAO', 
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
  },
});

module.exports = GoalInstanceStateHistory;