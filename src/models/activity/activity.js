import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import ActivityStateHistory from './activityStateHistory.js';
import Dependency from './dependency.js';
import Keyword from '../areaOfLife/keyword.js';
import ActivityKeyword from './activityKeyword.js';


import { ACTIVITY_TYPE, ACTIVITY_STATE, IMPORTANCE_NAMES, DIFFICULTY_NAMES } from '../../util/enum.js';


const Activity = sequelize.define('activity', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  activityType: {
    type: Sequelize.ENUM(ACTIVITY_TYPE),
    allowNull: false,
    defaultValue: ACTIVITY_TYPE[0],
  },
  activityState: {
    type: Sequelize.ENUM(ACTIVITY_STATE),
    allowNull: false,
    defaultValue: ACTIVITY_STATE[0],
  },
  importance: {
    type: Sequelize.ENUM(IMPORTANCE_NAMES),
    allowNull: false,
  },
  difficulty: {
    type: Sequelize.ENUM(DIFFICULTY_NAMES),
    allowNull: false,
  },
});

Activity.hasMany(ActivityStateHistory, { onDelete: 'CASCADE' });
ActivityStateHistory.belongsTo(Activity);

Activity.hasMany(Dependency, { foreignKey: 'dependentActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'dependentActivityId' });

Activity.hasMany(Dependency, { foreignKey: 'requiredActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'requiredActivityId' });

Activity.belongsToMany(Keyword, { through: ActivityKeyword });
Keyword.belongsToMany(Activity, { through: ActivityKeyword });

export default Activity;