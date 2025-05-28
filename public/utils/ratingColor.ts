/**
 * Возвращает цвет для заданного рейтинга (от 0 до 10).
 * @param {number} rating - рейтинг от 0 до 10
 * @returns {string} цвет в hex формате
 */
export function getRatingColor(rating: number): string {
  if (rating <= 0) return '#ccc';
  if (rating <= 1) return '#8c0d04';
  if (rating <= 2) return '#fa2c15';
  if (rating <= 3) return '#fa5615';
  if (rating <= 4) return '#fa9e15';
  if (rating <= 5) return '#fab115';
  if (rating <= 6) return '#facc15';
  if (rating <= 7) return '#a6fa15';
  if (rating <= 8) return '#41c42d';
  if (rating <= 9) return '#168c04';
  if (rating <= 10) return '#136602';
  return '#ccc';
}

