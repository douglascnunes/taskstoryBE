import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const LifeGoalKeyword = sequelize.define('lifeGoalKeyword', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

export default LifeGoalKeyword;
