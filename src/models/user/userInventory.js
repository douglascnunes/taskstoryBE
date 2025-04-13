import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

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

export default Inventory;