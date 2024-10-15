const Sequelize = require('sequelize');

const sequelize = require('../../util/db.js');

const Priority = sequelize.define('priority', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pointsMultiplier: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lowerRangeWeight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  upperRangeWeight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
});

module.exports = Priority;