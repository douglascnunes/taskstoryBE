const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ActivityStateHistory = require('./activityStateHistory.js');
const Dependency = require('./dependency.js')


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

Activity.hasMany(Dependency, { foreignKey: 'dependentActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'dependentActivityId' });

Activity.hasMany(Dependency, { foreignKey: 'requiredActivityId', onDelete: 'CASCADE' });
Dependency.belongsTo(Activity, { foreignKey: 'requiredActivityId' });


module.exports = Activity;