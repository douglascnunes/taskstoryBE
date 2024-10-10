const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const UserAreaOfLifePreference = sequelize.define('userAreaOfLifePreference', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  preferenceType: {
    type: Sequelize.ENUM('DESEJAVEL', 'MENOS_REALIZADA'),
    allowNull: false,
  },
});


module.exports = UserAreaOfLifePreference;