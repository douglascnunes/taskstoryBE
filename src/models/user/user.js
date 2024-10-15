const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Activity = require('../activity/activity.js');
const Keyword = require('../areaOfLife/keyword.js');
const AreaOfLife = require('../areaOfLife/areaOfLife.js');
const UserAreaOfLifeConfig = require('./userAreaofLifeConfig.js');

const UserSessionDay = require('./userSessionDay.js');
const LifeGoal = require('./lifeGoal.js');
const UserLevel = require('./userLevel.js');

const Item = require('../gamification/item.js');
const Inventory = require('./userInventory.js');
const GamificationComponent = require('../gamification/gamificationComponent.js');
const UserGamiComponent = require('./userGamiComponent.js');

const ENUM = require('../../util/enum.js');


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
  totalLevelPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  currentLevelPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }, 
  selfRegulationPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  selfEfficacynPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  initalDateQuadrant: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: new Date,
  },
  procrastinationType: {
    type: Sequelize.ENUM(ENUM.PROCRASTINATION_TYPE),
    allowNull: false,
    defaultValue: ENUM.PROCRASTINATION_TYPE[-1],
  },
  priorityEvolutionLimite: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  priorityEvolutionLimiteValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
  invertSection: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  recordLoginDailyStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  recordGTDMethodWeeklyStreak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  notificationDotMission: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  notificationDotThophie: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});


User.hasMany(UserSessionDay, { onDelete: 'CASCADE' });
UserSessionDay.belongsTo(User);

User.hasMany(Activity, { onDelete: 'CASCADE' });
Activity.belongsTo(User, { allowNull: false });

User.belongsTo(UserLevel);
UserLevel.hasMany(User);

User.hasMany(Keyword, { onDelete: 'CASCADE' });
Keyword.belongsTo(User, { allowNull: true });

User.belongsToMany(AreaOfLife, { through: UserAreaOfLifeConfig, onDelete: 'CASCADE' });
AreaOfLife.belongsToMany(User, { through: UserAreaOfLifeConfig, onDelete: 'CASCADE' });

User.hasMany(LifeGoal, { onDelete: 'CASCADE' });
LifeGoal.belongsTo(User, { allowNull: true });

User.belongsToMany(Item, { through: Inventory, onDelete: 'CASCADE' });
Item.belongsToMany(User, { through: Inventory, onDelete: 'CASCADE' });

User.belongsToMany(GamificationComponent, { through: UserGamiComponent, onDelete: 'CASCADE' });
GamificationComponent.belongsToMany(User, { through: UserGamiComponent, onDelete: 'CASCADE' });


module.exports = User;