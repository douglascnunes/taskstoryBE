import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

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
},
  { timestamps: false }
);

export default Step;
