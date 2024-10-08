const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const SubTask = sequelize.define('subTask', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});


module.exports = SubTask;
