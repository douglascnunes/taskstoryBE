import UserLevel from "../../models/user/userLevel.js";
import User from '../../models/user/user.js';
import { PROCRASTINATION_TYPE } from "../enum.js";


async function calculateUserLevel(userLevel, currentLevelPoints, points) {
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

  return { newLevel: userLevel, newRemainsPoints: remainsPoints };
};




async function calculateSelfRegEffPoints(currentSelfRegPoints, currentSelfEffPoints, selfRegPoints, selfEffPoints) {
  const newSelfRegPoints = Math.min(5, Math.max(0, currentSelfRegPoints + selfRegPoints));
  const newSelfEffPoints = Math.min(5, Math.max(0, currentSelfEffPoints + selfEffPoints));

  return { newSelfRegPoints, newSelfEffPoints };
}



function getProcrastinationType(selfRegulationPoints, selfEfficacyPoints) {
  const MID = 2.5;

  const isLowReg = selfRegulationPoints < MID;
  const isLowEff = selfEfficacyPoints < MID;

  if (isLowReg && isLowEff) return PROCRASTINATION_TYPE[1]; // 1 → SUPERPROCRASTINATOR

  if (!isLowReg && isLowEff) return PROCRASTINATION_TYPE[2]; // 2 → PERFECTIONIST

  if (isLowReg && !isLowEff) return PROCRASTINATION_TYPE[3]; // 3 → DISORGANIZED

  return PROCRASTINATION_TYPE[4]; // 4 → ANTIPROCRASTINATOR
}


export async function awardsPoints(userId, actions, transaction) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'totalLevelPoints', 'currentLevelPoints', 'selfRegulationPoints', 'selfEfficacynPoints'],
    include: [
      {
        model: UserLevel,
        required: true,
        attributes: ['level', 'expRequiredToUp']
      }
    ],
    transaction
  });

  console.log('user for awarding points', userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  };

  const [reduceLevelPoints, reduceSelfRegPoints, reduceSelfEffPoints] = actions.reduce(
    (acc, [pointArray, count]) => {
      acc[0] += pointArray[0] * count;
      acc[1] += pointArray[1] * count;
      acc[2] += pointArray[2] * count;
      return acc;
    },
    [0, 0, 0]
  );

  const { newLevel, newRemainsPoints } = await calculateUserLevel(
    user.userLevel,
    user.currentLevelPoints,
    reduceLevelPoints
  );

  const { newSelfRegPoints, newSelfEffPoints } = await calculateSelfRegEffPoints(
    user.selfRegulationPoints,
    user.selfEfficacynPoints,
    reduceSelfRegPoints,
    reduceSelfEffPoints
  );

  const newProcrastinationType = getProcrastinationType(
    newSelfRegPoints,
    newSelfEffPoints
  );

  await user.update({
    currentLevelPoints: newRemainsPoints,
    userLevelId: newLevel.id,
    totalLevelPoints: user.totalLevelPoints + reduceLevelPoints,
    selfRegulationPoints: newSelfRegPoints,
    selfEfficacynPoints: newSelfEffPoints,
    procrastinationType: newProcrastinationType
  }, { transaction });


  return {
    user,
    diffLevelPoints: reduceLevelPoints,
    diffSelfRegPoints: reduceSelfRegPoints,
    diffSelfEffPoints: reduceSelfEffPoints,
    newLevel: newLevel,
    newRemainsPoints,
    newSelfRegPoints,
    newSelfEffPoints,
    // totalPointsGained: points
  };
}