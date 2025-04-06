const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const Keyword = sequelize.define('keyword', {
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
},
  { timestamps: false }
);


module.exports = Keyword;