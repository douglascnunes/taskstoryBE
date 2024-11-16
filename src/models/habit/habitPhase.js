const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const HabitPhase = sequelize.define('habitPhase', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  phaseLevel: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  initialGoalCountDay: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  goalValueI: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  goalValueF: {
    type: Sequelize.FLOAT,
  },
  // perfectGoalValue: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // },
  isDone: {
    type: Sequelize.DATE,
    allowNull: true,    
  }
});


module.exports = HabitPhase;
