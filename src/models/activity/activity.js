import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import ActivityStatusHistory from './activityStatusHistory.js';
import Dependency from './dependency.js';
import Keyword from '../areaOfLife/keyword.js';
import ActivityKeyword from './activityKeyword.js';


import { ACTIVITY_TYPE, STATUS, IMPORTANCE_NAMES, DIFFICULTY_NAMES } from '../../util/enum.js';
import User from '../user/user.js';


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
  type: {
    type: Sequelize.ENUM(ACTIVITY_TYPE),
    allowNull: false,
    defaultValue: ACTIVITY_TYPE[0],
  },
  status: {
    type: Sequelize.ENUM(STATUS),
    allowNull: false,
    defaultValue: STATUS[0],
  },
  importance: {
    type: Sequelize.ENUM(IMPORTANCE_NAMES),
    allowNull: false,
  },
  difficulty: {
    type: Sequelize.ENUM(DIFFICULTY_NAMES),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
},
  { timestamps: false }
);

Activity.hasMany(ActivityStatusHistory, { onDelete: 'CASCADE' });
ActivityStatusHistory.belongsTo(Activity);

Activity.belongsToMany(Activity, {
  as: 'dependents',
  through: Dependency,
  foreignKey: 'dependencyId',
  otherKey: 'activityId',
  allowNull: true,
});

Activity.belongsToMany(Activity, {
  as: 'dependencies',
  through: Dependency,
  foreignKey: 'activityId',
  otherKey: 'dependencyId',
  allowNull: true,
});

Activity.belongsToMany(Keyword, { through: ActivityKeyword });
Keyword.belongsToMany(Activity, { through: ActivityKeyword });

User.hasMany(Activity, { onDelete: 'CASCADE' });
Activity.belongsTo(User, { allowNull: false });

export default Activity;