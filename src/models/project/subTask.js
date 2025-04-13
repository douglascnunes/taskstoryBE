import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const SubTask = sequelize.define('subTask', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

export default SubTask;
