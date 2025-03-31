exports.ACTIVITY_TYPE = [
  'ACTIVITY',  // Some models have this first value as default = [0]
  'TASK',
  'PROJECT',
  'HABIT',
  'GOAL',
  'PLANNING',
];


exports.ACTIVITY_STATE = [
  'REFERENCE',  // Some models have this first value as default = [0]
  'SPECIALIZED',
  'DELETED',
  'TRASH',
];

exports.SPECIALIZATION_STATE = [
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

exports.IMPORTANCE_NAME = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

exports.DIFFICULTY_NAME = [
  'LOW',
  'MEDIUM',
  'HIGH',
];

exports.PRIORITY_NAME = [
  'MINIMAL',
  'LOW',
  'MEDIUM',
  'HIGH',
  'MAXIMUM',
  'URGENT',
];

exports.INSTANCE_STATE = [
  'TODO',  // Some models have this first value as default = [0]
  'DOING',
  'WAITING',
  'COMPLETED',
  'COMPLETEDLATE',
  'LATE',
  'DELETED',
  'PAUSED',
];

exports.MISSION_TYPE = [
  'SELFREGULATION',
  'SELFEFFICACY',
  'SPECIAL',
  'COMMON',
];

exports.CHALLENGE_TYPE = [
  'TRACKACTIVITY',
  'TRACKKEYWORD',
  'TRACKGENERALINFO',
];

exports.HABIT_NOTIFICATION_TYPE = [
  'HOURSBEFORE',
  'ONLOGIN',
  'OFF',
];

exports.HABIT_GOAL_TYPE = [
  'SUCCESSSEQUENCE',  // Route validation for habit creation uses this position for verification
  'MINIMUMQUANTITYPERIOD',
  'AVERAGEVALUEPERIOD',
];

exports.PROCRASTINATION_TYPE = [
  'NOTDEFINED',  // Some models have this first value as default = [0]
  'SUPERPROCRASTINATOR',
  'PERFECTIONIST',
  'DISORGANIZED',
  'ANTIPROCRASTINATOR',
];

exports.USER_AREAOFLIFE_CONFIG = [
  'DESIRABLE',
  'MOSTPRACTICED',
];
