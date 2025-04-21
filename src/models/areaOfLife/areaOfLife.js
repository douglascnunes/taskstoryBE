import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Keyword from './keyword.js';

const AreaOfLife = sequelize.define('areaOfLife', {
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
  colorAngle: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
},
  { timestamps: false }
);

AreaOfLife.hasMany(Keyword, { onDelete: 'CASCADE' }); // Uma AreaOfLife pode ter várias Keyword
Keyword.belongsTo(AreaOfLife, { onDelete: 'CASCADE' }); // Cada Keyword pertence a uma AreaOfLife

AreaOfLife.belongsTo(Keyword, { foreignKey: 'defaultKeywordId', onDelete: 'CASCADE', allowNull: true });

export default AreaOfLife;