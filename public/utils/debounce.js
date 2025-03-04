/**
 * Создаёт debouce функцию
 * @param {Function} func - функция, которую нужно выполнять с задержкой
 * @param {number} ms - задержка в миллисекундах, после которой функция будет вызвана.
 * @returns {Function} - новая функция, которая будет выполняться с задержкой.
 */
export function debounce(func, ms) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
}
