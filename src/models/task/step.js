const Sequelize = require('sequelize');
const sequelize = require('../../util/db');


const Step = sequelize.define('step', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


module.exports = Step;
