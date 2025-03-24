const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Activity = require('../activity/activity.js');

const Result = require('./result.js')


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


module.exports = Planning;
