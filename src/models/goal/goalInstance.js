const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const GoalInstanceStateHistory = require('./goalInstanceStateHistory.js')

const ENUM = require('../../util/enum.js');


const GoalInstance = sequelize.define('goalInstance', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  currentState: {
    type: Sequelize.ENUM(ENUM.SPECIALIZATION_STATE),
    allowNull: false,
    defaultValue: ENUM.SPECIALIZATION_STATE[0],
  },
  initialDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  finalDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  challengeCompletionStatus: {
    type: Sequelize.JSON,
    allowNull: true,
    // {challenge1: {count: integer, isDone: boolean}, challenge1: {count: integer, isDone: boolean}}
  },
  priorityEvolved: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});


GoalInstance.hasMany(GoalInstanceStateHistory, { onDelete: 'CASCADE' });
GoalInstanceStateHistory.belongsTo(GoalInstance);


module.exports = GoalInstance;
