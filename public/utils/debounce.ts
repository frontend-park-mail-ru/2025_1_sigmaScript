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

/* Оригинал:

 export function debounce(func, ms) {
   let timeout;
   return function () {
     clearTimeout(timeout);
     timeout = setTimeout(() => func.apply(this, arguments), ms);
   };
 }
*/

/* Пояснения для доказательства понимания процесса:

   Для сохранения типобезопасноти переданной в debounce функции необходимо задать типы входных параметров func.
   Применяются generic, которые позволяют запомнить переданные параметры при помощи обобщенных шаблонизироваеых типов.
   
   Сами параметры: 
   - T: Прередача первым аргументом типа this - синтаксис TS
   - A extends any[]: Говорим, что A обобщенная с ограничениями, а именно любой массив. Используется для хранения оригинальных параметров
   - R: Тип возвращаемого значения оригинальной функции 
 
   Далее указываем сами параметры debounce:
   - func: (this: T, ...args: A) => R (используем rest оператор, чтобв собрать все в массив, требуемый типом A)
   - ms
 
   Выводим тип timeoutId. Так как возвращаемый функцией setTimeout тип зависит от платформы использования, находим этот тип динамически при помощи ReturnType<typeof>. 
 
   Остальное работает по страой логике)
*/
