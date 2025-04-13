import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

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

export default ItemReward;