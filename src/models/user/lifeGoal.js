import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Keyword from '../areaOfLife/keyword.js';
import Planning from '../planning/planning.js';
import LifeGoalKeyword from './lifeGoalKeyword.js';

const LifeGoal = sequelize.define('lifeGoal', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isDone: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});

LifeGoal.belongsToMany(Keyword, { through: LifeGoalKeyword });
Keyword.belongsToMany(LifeGoal, { through: LifeGoalKeyword });

LifeGoal.belongsTo(Planning, { foreignKey: 'trackedPlanningId', allowNull: true });

export default LifeGoal;