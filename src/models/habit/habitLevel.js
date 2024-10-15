const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const HabitLevel = sequelize.define('habitLevel', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  expRequiredToUp: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});


module.exports = HabitLevel;
