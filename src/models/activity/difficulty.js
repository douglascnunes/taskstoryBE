const Sequelize = require('sequelize');
const sequelize = require('../../util/db.js');


const ENUM = require('../../util/enum.js');


const Difficulty = sequelize.define('difficulty', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.ENUM(ENUM.DIFFICULTY_NAME),
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
},
  { timestamps: false }
);

module.exports = Difficulty;