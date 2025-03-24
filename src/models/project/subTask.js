const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const SubTask = sequelize.define('subTask', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});


module.exports = SubTask;
