const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Activity = require('../activity/activity.js');
const Importance = require('../activity/importance');
const Difficulty = require('../activity/difficulty');

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
Activity.hasOne(Task, { foreignKey: 'activityId', onDelete: 'CASCADE'});
Task.belongsTo(Activity, { foreignKey: 'activityId', allowNull: false});

// Uma Task tem vários Step e  Um Step pertence a uma única Task
Task.hasMany(Step, {foreignKey: 'taskId', onDelete: 'CASCADE'});
Step.belongsTo(Task, {foreignKey: 'taskId', allowNull: false});

// Uma Task tem várias TaskInstance
Task.hasMany(TaskInstance, { foreignKey: 'taskId', allowNull: false, onDelete: 'CASCADE'});
TaskInstance.belongsTo(Task, { foreignKey: 'taskId', allowNull: false});

// Relacionando Task com Importance e Difficulty
Task.belongsTo(Importance, { foreignKey: 'importanceId', allowNull: false });
Importance.hasMany(Task, { foreignKey: 'importanceId' });

Task.belongsTo(Difficulty, { foreignKey: 'difficultyId', allowNull: false });
Difficulty.hasMany(Task, { foreignKey: 'difficultyId' });


module.exports = Task;
