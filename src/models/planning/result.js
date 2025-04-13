import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import Activity from '../activity/activity.js';

const Result = sequelize.define('result', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

Result.belongsTo(Activity, { foreignKey: 'trackedActivityId', allowNull: true });

export default Result;
