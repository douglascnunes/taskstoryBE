import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { PRIORITY_NAME } from '../../util/enum.js';

const Priority = sequelize.define('priority', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.ENUM(PRIORITY_NAME),
    allowNull: false,
  },
  pointsMultiplier: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lowerRangeWeight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  upperRangeWeight: {
    type: Sequelize.FLOAT,
    allowNull: false,
  }
},
  { timestamps: false }
);

export default Priority;