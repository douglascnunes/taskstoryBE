import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import GamificationComponent from './gamificationComponent.js';

const Trophy = sequelize.define('trophy', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

GamificationComponent.hasOne(Trophy, { onDelete: 'CASCADE' });
Trophy.belongsTo(GamificationComponent, { allowNull: false });

export default Trophy;