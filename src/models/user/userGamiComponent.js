const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const UserGamiComponent = sequelize.define('userGamiComponent', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  completedDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});


module.exports = UserGamiComponent;