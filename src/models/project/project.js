const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');

const Activity = require('../activity/activity.js');

const SubTask = require('./subTask.js');
const TaskInstance = require('../task/taskInstance.js');


const Project = sequelize.define('project', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});


Activity.hasOne(Project, { onDelete: 'CASCADE' });
Project.belongsTo(Activity, { allowNull: false });

Project.belongsToMany(TaskInstance, { through: SubTask });
TaskInstance.belongsToMany(Project, { through: SubTask });


module.exports = Project;
