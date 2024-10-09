const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const UserSessionDay = require('./userSessionDay.js');

const Activity = require('../activity/activity.js');
const Keyword = require('../areaOfLife/keyword.js');
const AreaOfLife = require('../areaOfLife/areaOfLife.js');


const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dateBirth: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  accountLevel: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalLevelPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  currentLevelPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }, 
  selfRegulationPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  selfEfficacynPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  selfRegulationPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  initalDateQuadrant: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  procrastinationType: {
    type: Sequelize.ENUM(
      'SUPER_PROCRASTINADOR',
      'PERFECCIONISTA',
      'DESORGANIZADO',
      'ANTIPROCRASTINADOR',
      'USUARIO_PADRAO'
    ),
    allowNull: false,
  },
  priorityEvolutionLimite: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  priorityEvolutionLimiteValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  invertSection: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  recordLoginDailyStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  recordGTDMethodWeeklyStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  notificationDotMission: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  notificationDotThophie: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});


User.hasMany(UserSessionDay, { onDelete: 'CASCADE' });
UserSessionDay.belongsTo(User);

User.hasMany(Activity, { onDelete: 'CASCADE' });
Activity.belongsTo(User, { allowNull: false });

User.hasMany(Keyword, { onDelete: 'CASCADE' });
Keyword.belongsTo(User, { allowNull: true });

User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'desireAreaOfLife1' });
User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'desireAreaOfLife2' });
User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'desireAreaOfLife3' });

User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'lessAreaOfLife1' });
User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'lessAreaOfLife2' });
User.belongsTo(AreaOfLife, { allowNull: true, foreignKey: 'lessAreaOfLife3' });


module.exports = User;