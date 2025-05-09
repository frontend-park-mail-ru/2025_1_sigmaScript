/**
 * Создаёт debounced-функцию, которая откладывает вызов `func` до тех пор,
 * пока не пройдёт `ms` миллисекунд с момента последнего вызова debounced-функции.
 *
 * @template T - Тип контекста `this`, с которым будет вызываться оригинальная функция `func`.
 * @template A - Тип массива аргументов, которые принимает оригинальная функция `func`. `A` должен быть подтипом `any[]`.
 * @template R - Тип значения, которое возвращает оригинальная функция `func`.
 *
 * @param {(this: T, ...args: A) => R} func - Функция, вызов которой нужно задерживать.
 *        Она будет вызвана с контекстом `T` и аргументами типа `A`, и ожидается, что вернет значение типа `R`.
 * @param {number} ms - Задержка в миллисекундах. Вызов `func` произойдет через `ms` миллисекунд
 *        после того, как debounced-функция не вызывалась.
 *
 * @returns {(this: T, ...args: A) => void} - Новая debounced-функция.
 *          Эта функция принимает тот же контекст `this` (типа `T`) и те же аргументы (типа `A`),
 *          что и оригинальная `func`. Она ничего не возвращает (`void`), так как `func`
 *          вызывается асинхронно.
 */

export function debounce<T, A extends any[], R>(
  func: (this: T, ...args: A) => R,
  ms: number
): (this: T, ...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: T, ...args: A): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, ms);
  };
}
