const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const ActivityKeyword = sequelize.define('activityKeyword', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


module.exports = ActivityKeyword;
