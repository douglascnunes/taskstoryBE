const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const LifeGoalKeyword = sequelize.define('lifeGoalKeyword', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


module.exports = LifeGoalKeyword;
