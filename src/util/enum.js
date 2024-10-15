exports.ACTIVITY_TYPE = [
  'ACTIVITY',  // Alguns models possuem este primeiro valor como default = [0]
  'TASK',
  'PROJECT',
  'HABIT',
  'GOAL',
  'PLANNING',
];

exports.ACTIVITY_STATE = [
  'REFERENCIA',  // Alguns models possuem este primeiro valor como default = [0]
  'INCUBACAO', 
  'AFAZER', 
  'FAZENDO', 
  'AGUARDANDO', 
  'CONCLUIDA', 
  'CONCLUIDAATRASADA', 
  'ATRASADA', 
  'EXCLUIDA', 
  'PAUSADA',
  'LIXO', 
];

exports.INSTANCE_STATE = [
  'AFAZER',  // Alguns models possuem este primeiro valor como default = [0] 
  'FAZENDO', 
  'AGUARDANDO', 
  'CONCLUIDA', 
  'CONCLUIDAATRASADA', 
  'ATRASADA', 
  'EXCLUIDA', 
  'PAUSADA',
];

exports.MISSION_TYPE = [
  'AUTORREGULACAO',
  'AUTOEFICACIA',
  'ESPECIAL',
  'COMUM',
];

exports.CHALLENGE_TYPE = [
  'RASTREARATIVIDADE',
  'RASTREARPALAVRACHAVE',
  'RASTREARINFOGERAIS',
];

exports.HABIT_NOTIFICATION_TYPE = [
  'HORASANTES',
  'NOLOGIN',
  'DESLIGADO',
];

exports.HABIT_GOAL_TYPE = [
  'QUANTIDADEMINIMAPERIODO',
  'SEQUENCIASUCESSO',
  'VALORMEDIOPERIODO',
];

exports.PROCRASTINATION_TYPE = [
  'SUPERPROCRASTINADOR',
  'PERFECCIONISTA',
  'DESORGANIZADO',
  'ANTIPROCRASTINADOR',
  'NAODEFINIDO',  // Alguns models possuem este último valor como default = [-1]
];

exports.USER_AREAOFLIFE_CONFIG = [
  'DESEJAVEL',
  'MENOSREALIZADA',
];