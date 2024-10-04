const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const Difficulty = sequelize.define('difficulty', {
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
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = Difficulty;