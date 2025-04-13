import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const UserSessionDay = sequelize.define('userSessionDay', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  loginPerformed: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  currentLoginDailyStreak: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  gtdMethodCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  currentGTDMethodWeeklyStreak: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  activitiesCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  activitiesCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  activitiesOverdueCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  currentActivitiesOverdue: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  activitiesDeleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  currentActivitiesPaused: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  tasksCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tasksCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  projectsCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  projectsCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  habitsCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  habitsCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  goalsCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  goalsCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  planningsCreated: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  planningsCompleted: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gtdmethodFirstPhaseCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gtdmethodSecondPhaseCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  gtdmethodThirdPhaseCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default UserSessionDay;