const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Activity = require('./activity');
const Step = require('./step');
const TaskInstance = require('./taskInstance');


const Task = sequelize.define('task', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  initialDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  frequenceIntervalDays: {
    type: Sequelize.STRING,
    allowNull: true
  },
  frequenceWeeklyDays: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  instanceStrikeRecord: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
});


// Definindo a relação de herança (1-para-1) entre Task e Activity
Task.belongsTo(Activity, { foreignKey: 'activityId', allowNull: false});
Activity.hasOne(Task, { foreignKey: 'activityId', onDelete: 'CASCADE'});

// Uma Task tem vários Step
Task.hasMany(Step, {foreignKey: 'taskId', onDelete: 'CASCADE'});

// Um Step pertence a uma única Task
Step.belongsTo(Task, {foreignKey: 'taskId', allowNull: false});

// Uma Task tem várias TaskInstance
Task.hasMany(TaskInstance, { foreignKey: 'taskId', allowNull: false, onDelete: 'CASCADE'});
TaskInstance.belongsTo(Task, { foreignKey: 'taskId', allowNull: false});

module.exports = Task;
