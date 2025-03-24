const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const HabitPhaseMultiplier = sequelize.define('habitPhaseMultiplier', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


module.exports = HabitPhaseMultiplier;
