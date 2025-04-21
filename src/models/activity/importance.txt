import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { IMPORTANCE_NAME } from '../../util/enum.js';

const Importance = sequelize.define('importance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.ENUM(IMPORTANCE_NAME),
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
},
  { timestamps: false }
);

export default Importance;