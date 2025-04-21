import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { DIFFICULTY_NAME } from '../../util/enum.js';

const Difficulty = sequelize.define('difficulty', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.ENUM(DIFFICULTY_NAME),
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
},
  { timestamps: false }
);

export default Difficulty;