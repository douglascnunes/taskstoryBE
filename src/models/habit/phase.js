const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const Phase = sequelize.define('phase', {
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
  goalCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  goalValue: {
    type: Sequelize.FLOAT,
  },
  perfectGoalValue: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});


module.exports = Phase;
