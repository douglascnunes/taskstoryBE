const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Inventory = sequelize.define('inventory', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  quantityUsed: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  quantityPurchased: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});


module.exports = Inventory;