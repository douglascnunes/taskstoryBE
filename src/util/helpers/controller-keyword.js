import { Op } from 'sequelize';
import Keyword from '../../models/areaOfLife/keyword.js';



export async function updateActivityKeywords({ activity, newKeywordIds, userId, transaction }) {

  const oldKeywords = await activity.getKeywords({ transaction });

  const newKeywords = await Keyword.findAll({
    where: {
      id: newKeywordIds,
      userId: { [Op.or]: [userId, null] },
    },
    transaction,
  });

  await activity.setKeywords(newKeywords, { transaction });

  return { oldKeywords, newKeywords };
}


export function calculateKeywordPoints({ oldKeywords, newKeywords, pointValue = 1, maxCount = 3 }) {
  const oldCount = Math.min(oldKeywords.length, maxCount);
  const newCount = Math.min(newKeywords.length, maxCount);
  return (newCount - oldCount) * pointValue;
}
