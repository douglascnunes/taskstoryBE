const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const GamificationComponent = require('./gamificationComponent.js');


const Trophy = sequelize.define('trophy', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


GamificationComponent.hasOne(Trophy, { onDelete: 'CASCADE' });
Trophy.belongsTo(GamificationComponent, {allowNull: false});


module.exports = Trophy;