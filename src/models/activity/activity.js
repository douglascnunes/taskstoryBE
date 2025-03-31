const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ActivityStateHistory = require('./activityStateHistory.js');
const Difficulty = require('./difficulty.js')
const Importance = require('./importance.js')
const Priority = require('./priority.js')
const Dependency = require('./dependency.js');
const Keyword = require('../areaOfLife/keyword.js');
const ActivityKeyword = require('./activityKeyword.js');

const ENUM = require('../../util/enum.js');


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
    type: Sequelize.ENUM(ENUM.ACTIVITY_TYPE),
    allowNull: false,
    defaultValue: ENUM.ACTIVITY_TYPE[0],
  },
  activityState: {
    type: Sequelize.ENUM(ENUM.ACTIVITY_STATE),
    allowNull: false,
    defaultValue: ENUM.ACTIVITY_STATE[0],
  }
});


Activity.hasMany(ActivityStateHistory, { onDelete: 'CASCADE' });
ActivityStateHistory.belongsTo(Activity);

Activity.belongsTo(Importance, {allowNull: true });
Importance.hasMany(Activity);

Activity.belongsTo(Difficulty, {allowNull: true });
Difficulty.hasMany(Activity);

Activity.belongsTo(Priority, {allowNull: true });
Priority.hasMany(Activity);

Activity.hasMany(Dependency, { foreignKey: 'dependentActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'dependentActivityId' });

Activity.hasMany(Dependency, { foreignKey: 'requiredActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'requiredActivityId' });

Activity.belongsToMany(Keyword, { through: ActivityKeyword });
Keyword.belongsToMany(Activity, { through: ActivityKeyword });


module.exports = Activity;