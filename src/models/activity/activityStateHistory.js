const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const ENUM = require('../../util/enum');

const ActivityStateHistory = sequelize.define('activityStateHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  state: {
    type: Sequelize.ENUM(ENUM.ACTIVITY_TYPE),
    allowNull: false,
  },
});

module.exports = ActivityStateHistory;