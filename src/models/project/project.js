import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import SubTask from './subTask.js';
import TaskInstance from '../task/taskInstance.js';

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
},
  { timestamps: false }
);

Activity.hasOne(Project, { onDelete: 'CASCADE' });
Project.belongsTo(Activity, { allowNull: false });

Project.belongsToMany(TaskInstance, { through: SubTask });
TaskInstance.belongsToMany(Project, { through: SubTask });

export default Project;
