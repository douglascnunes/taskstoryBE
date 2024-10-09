const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const GamificationComponent = require('./gamificationComponent.js');


const Mission = sequelize.define('mission', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category: {
    type: Sequelize.ENUM(
      'AUTORREGULACAO',
      'AUTOEFICACIA',
      'ESPECIAL',
      'COMUM',
    ),
    allowNull: false,
  },
  unlockLevel: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});


GamificationComponent.hasOne(Mission, { onDelete: 'CASCADE' });
Mission.belongsTo(GamificationComponent, {allowNull: false});


module.exports = Mission;