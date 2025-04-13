import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import Medal from './medal.js';


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

export default MedalTierList;