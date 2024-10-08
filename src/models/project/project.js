const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const SubTask = require('./subTask.js')
const TaskInstance = require('../task/taskInstance.js')


const Project = sequelize.define('project', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});


Activity.hasOne(Project, { onDelete: 'CASCADE' });
Project.belongsTo(Activity, { allowNull: false });

Project.belongsToMany(TaskInstance, { through: SubTask });
TaskInstance.belongsToMany(Project, { through: SubTask });


module.exports = Project;
