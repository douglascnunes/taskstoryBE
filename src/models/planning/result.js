const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Activity = require('../activity/activity');


const Result = sequelize.define('result', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});


Result.belongsTo(Activity, { foreignKey: 'trackedActivityId', allowNull: true});


module.exports = Result;
