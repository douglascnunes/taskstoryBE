import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import Requirement from './requirement.js';
import GamiCompRequirement from './gamiCompReq.js';
import Item from './item.js';
import ItemReward from './ItemReward.js';

const GamificationComponent = sequelize.define('gamificationComponent', {
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
  description: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  requirementValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  selfRegulationPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  selfEfficacyPoints: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  levelPoints: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

GamificationComponent.belongsToMany(Requirement, { through: GamiCompRequirement });
Requirement.belongsToMany(GamificationComponent, { through: GamiCompRequirement });

GamificationComponent.belongsToMany(Item, { through: ItemReward });
Item.belongsToMany(GamificationComponent, { through: ItemReward });

export default GamificationComponent;
