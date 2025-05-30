import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

const HabitPhaseMultiplier = sequelize.define('habitPhaseMultiplier', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
});

export default HabitPhaseMultiplier;
