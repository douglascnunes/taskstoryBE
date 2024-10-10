const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USER, 
  process.env.DATABASE_PW,
  {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    logging: false,
  }
)

module.exports = sequelize;