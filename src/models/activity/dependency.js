const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const Dependency = sequelize.define('dependency', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
  }
});


module.exports = Dependency;
