import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import GamificationComponent from './gamificationComponent.js';
import { MISSION_TYPE } from '../../util/enum.js';


const Mission = sequelize.define('mission', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  category: {
    type: Sequelize.ENUM(MISSION_TYPE),
    allowNull: false,
  },
  unlockLevel: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

GamificationComponent.hasOne(Mission, { onDelete: 'CASCADE' });
Mission.belongsTo(GamificationComponent, { allowNull: false });

export default Mission;