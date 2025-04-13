import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { USER_AREAOFLIFE_CONFIG } from '../../util/enum.js';

const UserAreaOfLifeConfig = sequelize.define('userAreaOfLifeConfig', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  preferenceType: {
    type: Sequelize.ENUM(USER_AREAOFLIFE_CONFIG),
    allowNull: false,
  },
});

export default UserAreaOfLifeConfig;