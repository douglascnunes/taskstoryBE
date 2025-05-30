import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const Keyword = sequelize.define('keyword', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  colorAngle: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
},
  { timestamps: false }
);

export default Keyword;