const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const Requirement = require('./requirement');


const GamiCompRequirement = require('./gamiCompReq');
const Item = require('./item');
const ItemReward = require('./ItemReward');


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


module.exports = GamificationComponent;
