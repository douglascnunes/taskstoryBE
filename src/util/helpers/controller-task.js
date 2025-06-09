import { Op } from 'sequelize';
import Step from '../../models/task/step.js';
import { POINTS } from '../../util/enum.js';



export function getTaskPeriodFilter(startdate, finaldate) {
  return {
    [Op.or]: [
      {
        [Op.and]: [
          { startPeriod: null },
          { endPeriod: null },
        ]
      },
      {
        [Op.and]: [
          { startPeriod: null },
          { endPeriod: { [Op.gte]: startdate } }
        ]
      },
      {
        [Op.and]: [
          { endPeriod: null },
          { startPeriod: { [Op.lte]: finaldate } }
        ]
      },
      {
        [Op.and]: [
          { startPeriod: { [Op.lte]: finaldate } },
          { endPeriod: { [Op.gte]: startdate } }
        ]
      }
    ]
  };
};



export function buildTaskUpdateData(data) {
  const fields = ['startPeriod', 'endPeriod', 'frequenceIntervalDays', 'frequenceWeeklyDays', 'steps'];
  const updateData = {};

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field] ?? null;
    }
  }

  return updateData;
}


export function isSettingPeriodOrFrequencyForFirstTime(oldTask, newData) {
  const hadNoneBefore =
    !oldTask.startPeriod &&
    !oldTask.endPeriod &&
    !oldTask.frequenceIntervalDays &&
    (!oldTask.frequenceWeeklyDays || oldTask.frequenceWeeklyDays.length === 0);

  const settingNow =
    newData.startPeriod || newData.endPeriod || newData.frequenceIntervalDays ||
    (newData.frequenceWeeklyDays && newData.frequenceWeeklyDays.length > 0);

  return hadNoneBefore && settingNow;
};



export async function sanitizeStepCompletionStatus(stepCompletionStatus = [], transaction) {
  if (!Array.isArray(stepCompletionStatus) || stepCompletionStatus.length === 0) {
    return [];
  }

  const validSteps = await Step.findAll({
    where: { id: stepCompletionStatus },
    attributes: ['id'],
    transaction
  });

  const validStepIds = new Set(validSteps.map(s => s.id));
  return stepCompletionStatus.filter(id => validStepIds.has(id));
};


export function calculateStepCompletionPoints(oldStepIds = [], newStepIds = []) {
  const oldSet = new Set(oldStepIds);
  const newSet = new Set(newStepIds);

  let added = 0;
  let removed = 0;

  for (const id of newSet) {
    if (!oldSet.has(id)) added++;
  }

  for (const id of oldSet) {
    if (!newSet.has(id)) removed++;
  }

  return (added - removed) * POINTS.TASK.STEP.DONE;
};
