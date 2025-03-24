const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const PhaseMultiplier = sequelize.define('phaseMultiplier', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  percentEvo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  multiplier: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});


module.exports = PhaseMultiplier;
