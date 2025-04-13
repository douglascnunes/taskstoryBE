import Sequelize from 'sequelize';
import sequelize from '../../util/db.js';

import Activity from '../activity/activity.js';
import Keyword from '../areaOfLife/keyword.js';
import { CHALLENGE_TYPE } from '../../util/enum.js';
// const GeneralInformation = require('../');

const Challenge = sequelize.define('challenge', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: {
    type: Sequelize.ENUM(CHALLENGE_TYPE),
    allowNull: false,
  },
  goalValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tagName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

Challenge.belongsTo(Activity, { foreignKey: 'trackedActivityId', allowNull: true });
Challenge.belongsTo(Keyword, { foreignKey: 'trackedKeywordId', allowNull: true });

export default Challenge;