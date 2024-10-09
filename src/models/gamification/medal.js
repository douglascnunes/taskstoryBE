const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const GamificationComponent = require('./gamificationComponent.js');
// const MedalTierList = require('./medalTierList.js');


const Medal = sequelize.define('medal', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


GamificationComponent.hasMany(Medal, { onDelete: 'CASCADE' });
Medal.belongsTo(GamificationComponent);



module.exports = Medal;