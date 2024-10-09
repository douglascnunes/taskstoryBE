const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ActivityStateHistory = require('./activityStateHistory.js');
const Difficulty = require('./difficulty.js')
const Importance = require('./importance.js')
const Priority = require('./priority.js')
const Dependency = require('./dependency.js');
const Keyword = require('../areaOfLife/keyword.js');
const ActivityKeyword = require('./activityKeyword.js');


const Activity = sequelize.define('activity', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  activityType: {
    type: Sequelize.ENUM('activity','task','project','habit','goal','planing'),
    allowNull: false,
    defaultValue: 'activity',
  },
  currentState: {
    type: Sequelize.ENUM(
      'LIXO', 
      'REFERENCIA', 
      'INCUBACAO', 
      'A_FAZER', 
      'FAZENDO', 
      'AGUARDANDO', 
      'CONCLUIDA', 
      'CONCLUIDA_ATRASADA', 
      'ATRASADA', 
      'EXCLUIDA', 
      'PAUSADA'
    ),
    allowNull: false,
    defaultValue: 'REFERENCIA',
  }
});


Activity.hasMany(ActivityStateHistory, { onDelete: 'CASCADE' });
ActivityStateHistory.belongsTo(Activity);

Activity.belongsTo(Importance, {allowNull: false });
Importance.hasMany(Activity);

Activity.belongsTo(Difficulty, {allowNull: false });
Difficulty.hasMany(Activity);

Activity.belongsTo(Priority, {allowNull: false });
Priority.hasMany(Activity);

Activity.hasMany(Dependency, { foreignKey: 'dependentActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'dependentActivityId' });

Activity.hasMany(Dependency, { foreignKey: 'requiredActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'requiredActivityId' });

Activity.belongsToMany(Keyword, { through: ActivityKeyword });
Keyword.belongsToMany(Activity, { through: ActivityKeyword });


module.exports = Activity;