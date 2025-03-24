const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Medal = require('./medal.js');


const MedalTierList = sequelize.define('medalTierList', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


MedalTierList.belongsTo(Medal, { foreignKey: 'bronze' });
MedalTierList.belongsTo(Medal, { foreignKey: 'prata' });
MedalTierList.belongsTo(Medal, { foreignKey: 'ouro' });
MedalTierList.belongsTo(Medal, { foreignKey: 'rubi' });
MedalTierList.belongsTo(Medal, { foreignKey: 'safira' });
MedalTierList.belongsTo(Medal, { foreignKey: 'esmeralda' });
MedalTierList.belongsTo(Medal, { foreignKey: 'diamante' });

Medal.belongsTo(MedalTierList);


module.exports = MedalTierList;