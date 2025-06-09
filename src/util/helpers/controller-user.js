import UserLevel from "../../models/user/userLevel.js";
import User from '../../models/user/user.js';



async function userLeveling(userLevel, currentLevelPoints, points) {
  let remainsPoints = currentLevelPoints + points;

  // Subida de nível
  while (remainsPoints >= userLevel.expRequiredToUp) {
    remainsPoints -= userLevel.expRequiredToUp;

    const nextLevel = await UserLevel.findOne({
      where: { level: userLevel.level + 1 }
    });

    if (!nextLevel) break;

    userLevel = nextLevel;
  }

  // Regressão de nível
  while (remainsPoints < 0 && userLevel.level > 1) {
    const previousLevel = await UserLevel.findOne({
      where: { level: userLevel.level - 1 }
    });

    if (!previousLevel) break;

    remainsPoints += previousLevel.expRequiredToUp;
    userLevel = previousLevel;
  }

  // Garante que remainsPoints não seja negativo no nível 1
  if (userLevel.level === 1 && remainsPoints < 0) {
    remainsPoints = 0;
  }

  return { userLevel, remainsPoints };
};



export async function applyUserPoints({ userId, points, transaction }) {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        model: UserLevel,
        required: true,
        attributes: ['level', 'expRequiredToUp']
      }
    ]
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const { userLevel: actualLevel, remainsPoints } = await userLeveling(
    user.userLevel,
    user.currentLevelPoints,
    points
  );

  await user.update({
    currentLevelPoints: remainsPoints,
    userLevelId: actualLevel.id,
  }, { transaction });

  return {
    user,
    newLevel: actualLevel,
    remainsPoints,
    totalPointsGained: points
  };
}