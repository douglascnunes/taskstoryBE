const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Keyword = require('../areaOfLife/keyword.js');
const Planning = require('../planning/planning.js');
const LifeGoalKeyword = require('./lifeGoalKeyword.js');


const LifeGoal = sequelize.define('lifeGoal', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});


LifeGoal.belongsToMany(Keyword, { through: LifeGoalKeyword });
Keyword.belongsToMany(LifeGoal, { through: LifeGoalKeyword });

LifeGoal.belongsTo(Planning, { foreignKey: 'trackedPlanningId', allowNull: true });


module.exports = LifeGoal;