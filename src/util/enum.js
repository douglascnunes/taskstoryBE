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

export const IMPORTANCE_NAMES = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const IMPORTANCE_VALUES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export const DIFFICULTY_NAMES = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

export const DIFFICULTY_VALUES = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

export const PRIORITY_VALUES = {
  MINIMAL: [1, 1.5],
  LOW: [1.5, 2],
  MEDIUM: [2, 2.5],
  HIGH: [2.5, 3],
  MAXIMUM: [3, 3.5],
  URGENT: [999, 999],
};

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
