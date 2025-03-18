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

exports.IMPORTANCE_NAME = [
  'BAIXA',
  'MEDIA',
  'ALTA',
];

exports.DIFFICULTY_NAME = [
  'BAIXA',
  'MEDIA',
  'ALTA',
];

exports.PRIORITY_NAME = [
  'MINIMA',
  'BAIXA',
  'MEDIA',
  'ALTA',
  'MAXIMA',
  'URGENTE',
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
  'SEQUENCIASUCESSO',  // Validação da rota da criação de um habit usa esta posicao para verificação
  'QUANTIDADEMINIMAPERIODO',
  'VALORMEDIOPERIODO',
];

exports.PROCRASTINATION_TYPE = [
  'NAODEFINIDO',  // Alguns models possuem este primeiro valor como default = [0] 
  'SUPERPROCRASTINADOR',
  'PERFECCIONISTA',
  'DESORGANIZADO',
  'ANTIPROCRASTINADOR',
];

exports.USER_AREAOFLIFE_CONFIG = [
  'DESEJAVEL',
  'MAISPRATICADA',
];