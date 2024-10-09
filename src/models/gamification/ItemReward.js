const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ItemReward = sequelize.define('itemReward', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = ItemReward;