import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const Dependency = sequelize.define('dependency', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
  }
});

export default Dependency;
