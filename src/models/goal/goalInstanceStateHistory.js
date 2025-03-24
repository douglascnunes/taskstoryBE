const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ENUM = require('../../util/enum.js');


const GoalInstanceStateHistory = sequelize.define('goalInstanceStateHistory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  state: {
    type: Sequelize.ENUM(ENUM.INSTANCE_STATE),
    allowNull: false,
  },
});

module.exports = GoalInstanceStateHistory;