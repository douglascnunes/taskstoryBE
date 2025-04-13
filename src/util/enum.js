export const ACTIVITY_TYPE = [
  'ACTIVITY',  // Some models have this first value as default = [0]
  'TASK',
  'PROJECT',
  'HABIT',
  'GOAL',
  'PLANNING',
];

export const ACTIVITY_STATE = [
  'REFERENCE',  // Some models have this first value as default = [0]
  'SPECIALIZED',
  'DELETED',
  'TRASH',
];

export const SPECIALIZATION_STATE = [
  'INCUBATION',
  'TODO',
  'TODO_LATE',
  'WAITING',
  'WAITING_LATE',
  'DOING',
  'DOING_LATE',
  'COMPLETED',
  'COMPLETED_LATE',
  'PAUSED',
  'PAUSED_LATE',
  'DELETED',
];

export const IMPORTANCE_NAME = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const DIFFICULTY_NAME = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const PRIORITY_NAME = [
  'MINIMAL',
  'LOW',
  'MEDIUM',
  'HIGH',
  'MAXIMUM',
  'URGENT',
];

export const INSTANCE_STATE = [
  'TODO',  // Some models have this first value as default = [0]
  'DOING',
  'WAITING',
  'COMPLETED',
  'COMPLETEDLATE',
  'LATE',
  'DELETED',
  'PAUSED',
];

export const MISSION_TYPE = [
  'SELFREGULATION',
  'SELFEFFICACY',
  'SPECIAL',
  'COMMON',
];

export const CHALLENGE_TYPE = [
  'TRACKACTIVITY',
  'TRACKKEYWORD',
  'TRACKGENERALINFO',
];

export const HABIT_NOTIFICATION_TYPE = [
  'HOURSBEFORE',
  'ONLOGIN',
  'OFF',
];

export const HABIT_GOAL_TYPE = [
  'SUCCESSSEQUENCE',  // Route validation for habit creation uses this position for verification
  'MINIMUMQUANTITYPERIOD',
  'AVERAGEVALUEPERIOD',
];

export const PROCRASTINATION_TYPE = [
  'NOTDEFINED',  // Some models have this first value as default = [0]
  'SUPERPROCRASTINATOR',
  'PERFECTIONIST',
  'DISORGANIZED',
  'ANTIPROCRASTINATOR',
];

export const USER_AREAOFLIFE_CONFIG = [
  'DESIRABLE',
  'MOSTPRACTICED',
];
