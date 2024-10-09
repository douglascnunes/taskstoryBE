const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Activity = require('../activity/activity');
const Keyword = require('../areaOfLife/keyword');
// const GeneralInformation = require('../');



const Challenge = sequelize.define('challenge', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: Sequelize.ENUM(
    'RASTREAR_ATIVIDADE',
    'RASTREAR_PALAVRA_CHAVE',
    'RASTREAR_INFO_GERAIS',
    ),
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