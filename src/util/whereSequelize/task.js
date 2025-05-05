import { Op } from 'sequelize';

/**
 * Retorna uma cláusula Sequelize `where` para filtrar Tasks por startPeriod e endPeriod
 * conforme a lógica:
 * - Se startPeriod existe: startPeriod <= finaldate
 * - Se endPeriod existe: endPeriod >= startdate
 * - Se ambos são null: inclui
 * - Se apenas um é null: aplica o outro filtro
 */
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