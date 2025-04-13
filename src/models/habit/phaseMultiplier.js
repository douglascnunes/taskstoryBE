import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const PhaseMultiplier = sequelize.define('phaseMultiplier', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  percentEvo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  multiplier: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
}, 
  { timestamps: false }
);

export default PhaseMultiplier;
