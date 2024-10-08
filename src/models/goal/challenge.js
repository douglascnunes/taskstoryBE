const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Activity = require('../activity/activity');
// const Keyword = require('../');
// const GeneralInformation = require('../');



const Challenge = sequelize.define('habit', {
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
});

Challenge.hasOne(Activity, {allowNull: true});
// Challenge.hasOne(Keyword, {allowNull: true});
// Challenge.hasOne(GeneralInformation, {allowNull: true});


module.exports = Challenge;