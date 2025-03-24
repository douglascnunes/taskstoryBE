const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');

const Activity = require('../activity/activity.js');
const Keyword = require('../areaOfLife/keyword.js');
// const GeneralInformation = require('../');

const ENUM = require('../../util/enum.js');


const Challenge = sequelize.define('challenge', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: Sequelize.ENUM(ENUM.CHALLENGE_TYPE),
  allowNull: false,
  },
  goalValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

Challenge.belongsTo(Activity, {foreignKey: 'trackedActivityId', allowNull: true});
Challenge.belongsTo(Keyword, {foreignKey: 'trackedKeywordId', allowNull: true});
// Challenge.hasOne(GeneralInformation, {allowNull: true});


module.exports = Challenge;