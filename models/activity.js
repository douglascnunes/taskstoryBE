const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const Activity = sequelize.define('activity', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  activityType: {
    type: Sequelize.ENUM('activity','task','project','habit','goal','planing'),
    allowNull: false,
    defaultValue: 'activity',
  }
});

module.exports = Activity;