import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import Result from './result.js';

const Planning = sequelize.define('planning', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

Activity.hasOne(Planning, { onDelete: 'CASCADE' });
Planning.belongsTo(Activity, { allowNull: false });

Planning.hasMany(Result, { onDelete: 'CASCADE' });
Result.belongsTo(Planning);

export default Planning;
