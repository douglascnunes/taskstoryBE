export const POINTS = {
  ACTIVITY: {
    CREATE: [2, 0.02, 0],
    DESCRIPTION: [2, 0.02, 0],
    KEYWORD: [4, 0.04, 0],     // até 3
    DONE: [2, 0.00, 0.02],
    DELETE: [-2, -0.02, 0],
    DELETE_KEYWORD: [-4, -0.04, 0],     // para cada até 3
  },

  KEYWORD: {
    CREATE: [20, 0.20, 0],
    DELETE: [-20, -0.20, 0],
  },

  TASK: {
    CREATE: [10, 0.10, 0],  // registro pai
    PERIOD_AND_FREQUENCY: [4, 0.04, 0],  // adicionar prazo/freq
    DELETE: [-4, -0.04, 0],
    DELETE_WITH_PERIOD: [-4, -0.04, 0],
    DONE: [10, 0, 0.10], // instância
    DONE_LATE: [4, 0, 0.04],
    DONE_KEYWORD: [2, 0, 0.02], // até 3
    UNDO_DONE: [-10, 0, -0.10],
    UNDO_DONE_KEYWORD: [-2, 0, -0.02],
    DELETE_LATE_INSTANCE: [-4, -0.04, -0.04],
    STEP: {
      CREATE: [2, 0.02, 0],
      DONE: [2, 0, 0.02],
      DELETE: [-2, -0.02, 0],
    },
  },

  PROJECT: {
    CREATE: [20, 0.20, 0],
    DONE: [20, 0, 0.20],  // para cada tarefa associada
    UNDO_DONE: [-20, 0, -0.20],
    DELETE: [-20, -0.20, 0],
  },

  HABIT: {
    CREATE: [20, 0.20, 0],     // registro pai
    DONE: [4, 0, 0.04],  // instâncias sucesso – falhas × nível atual
    DELETE: [-20, -0.20, 0],
    DONE_SUCCESS: [10, 0, 0.10],  // instância
    DONE_FAIL: [-2, 0, -0.10],
    DONE_LATE: [-4, 0, -0.04],
    UNDO_DONE: [-10, 0, -0.10],
    DELETE_LATE_INSTANCE: [-4, -0.04, -0.04],
    LEVEL_UP: [4, 0, 0.04],  // × nível atual
  },

  GOAL: {
    CREATE: [40, 0.40, 0],
    PERIOD_AND_FREQUENCY: [4, 0.04, 0],
    DELETE: [-40, -0.40, 0],
    DONE: [30, 0, 0.30], // instância por desafio
    DONE_LATE: [-20, 0, -0.20],
  },

  CHALLENGE: {
    ADD: [10, 0.10, 0],
    DONE: [10, 0, 0.10],
    DELETE: [-10, -0.10, 0],
  },
};

export const MULTIPLIERS = {
  PRIORITY: {
    MINIMAL: 0.5,
    LOW: 0.75,
    MEDIUM: 1,
    HIGH: 1.25,
    MAXIMUM: 1.5,
    URGENT: 2,
  },
};
