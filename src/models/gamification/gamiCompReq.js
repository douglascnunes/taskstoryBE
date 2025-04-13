import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const GamiCompReq = sequelize.define('gamiCompReq', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

export default GamiCompReq;
