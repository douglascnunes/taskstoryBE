import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Keyword from '../areaOfLife/keyword.js';
import AreaOfLife from '../areaOfLife/areaOfLife.js';
import UserAreaOfLifeConfig from './userAreaofLifeConfig.js';

import UserSessionDay from './userSessionDay.js';
import LifeGoal from './lifeGoal.js';
import UserLevel from './userLevel.js';

import Item from '../gamification/item.js';
import Inventory from './userInventory.js';
import GamificationComponent from '../gamification/gamificationComponent.js';
import UserGamiComponent from './userGamiComponent.js';

import { PROCRASTINATION_TYPE } from '../../util/enum.js';

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
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "default.png",
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
    type: Sequelize.ENUM(PROCRASTINATION_TYPE),
    allowNull: false,
    defaultValue: PROCRASTINATION_TYPE[0],
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

export default User;