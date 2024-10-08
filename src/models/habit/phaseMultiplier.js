const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const PhaseMultiplier = sequelize.define('phasemultiplier', {
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
