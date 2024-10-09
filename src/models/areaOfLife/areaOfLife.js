const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Keyword = require('./keyword.js');


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
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});


AreaOfLife.hasMany(Keyword, { onDelete: 'CASCADE' }); // Uma AreaOfLife pode ter várias Keyword
Keyword.belongsTo(AreaOfLife, { onDelete: 'CASCADE' }); // Cada Keyword pertence a uma AreaOfLife

AreaOfLife.belongsTo(Keyword, { foreignKey: 'defaultKeywordId', onDelete: 'CASCADE' });


module.exports = AreaOfLife;