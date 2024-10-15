const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');

const ENUM = require('../../util/enum.js');


const UserAreaOfLifeConfig = sequelize.define('userAreaOfLifeConfig', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  preferenceType: {
    type: Sequelize.ENUM(ENUM.USER_AREAOFLIFE_CONFIG),
    allowNull: false,
  },
});


module.exports = UserAreaOfLifeConfig;