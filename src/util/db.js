import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USER, 
  process.env.DATABASE_PW,
  {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    // timezone: process.env.DATABASE_TIMEZONE,
    logging: false,
  }
);

export default sequelize;