/**
 * Создаёт функцию обертку, которая вызовет переданную функцию через ms миллисекунд от момента последнего вызова полученной debounced функции-обертки
 *
 * @template T - Тип this, с которым будет вызываться оригинальная функция func
 * @template A - Тип массива аргументов, которые принимает оригинальная функция func
 * @template R - Тип значения, которое возвращает оригинальная функция func
 *
 * @param {(this: T, ...args: A) => R} func - Функция, вызов которой нужно задержать.
 * @param {number} ms - Время задержки в миллисекундах
 * @returns {(this: T, ...args: A) => void} - Новая debounced функция-обертка
 */

export function debounce<T, A extends any[], R>(
  func: (this: T, ...args: A) => R,
  ms: number
): (this: T, ...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: T, ...args: A): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}
