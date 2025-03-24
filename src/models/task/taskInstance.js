const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const TaskInstanceStateHistory = require('./taskStateHistory.js')

const ENUM = require('../../util/enum.js');


const TaskInstance = sequelize.define('taskInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentState: {
    type: Sequelize.ENUM(ENUM.INSTANCE_STATE),
    allowNull: false,
    defaultValue: ENUM.INSTANCE_STATE[0],
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  stepCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {step1: boolean, step2: boolean, step3: boolean}
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});


TaskInstance.hasMany(TaskInstanceStateHistory, { onDelete: 'CASCADE' });
TaskInstanceStateHistory.belongsTo(TaskInstance);


module.exports = TaskInstance;
