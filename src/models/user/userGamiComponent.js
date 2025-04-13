import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

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

export default UserGamiComponent;