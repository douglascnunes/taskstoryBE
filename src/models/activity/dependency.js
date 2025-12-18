import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';
import { DEPENDENCY } from '../../util/enum.js';

const Dependency = sequelize.define('dependency', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  instanceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dependencyId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dependencyInstanceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM(DEPENDENCY),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

export default Dependency;
