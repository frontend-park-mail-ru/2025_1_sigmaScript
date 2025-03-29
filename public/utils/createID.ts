/**
 * Генерирует случайный id, похожий на uuid
 *
 * @returns {string} случайный id.
 */
export function createID(): string {
  let id = '';
  const alphabet = '0123456789abcdef';
  for (let i = 0; i < 32; i++) {
    id += alphabet[Math.round(Math.random() * 15)];
  }
  return (
    id.slice(0, 8) + '-' + id.slice(8, 12) + '-' + id.slice(12, 16) + '-' + id.slice(16, 20) + '-' + id.slice(20, 32)
  );
}
