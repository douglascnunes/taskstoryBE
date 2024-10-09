const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const GamiCompReq = sequelize.define('gamiCompReq', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


module.exports = GamiCompReq;
