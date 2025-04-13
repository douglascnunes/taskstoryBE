import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import GamificationComponent from './gamificationComponent.js';
// import MedalTierList from './medalTierList.js';

const Medal = sequelize.define('medal', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

GamificationComponent.hasMany(Medal, { onDelete: 'CASCADE' });
Medal.belongsTo(GamificationComponent);

export default Medal;