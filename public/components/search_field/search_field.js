
/**
 * Элемент поиска с полем ввода поиска и возможностью установки рядом кнопки
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - уникальный id элемента
 * @param {string} config.inputClasses - классы поля поиска
 * @param {string} config.searchFormId - уникальный id формы поиска
 * @param {string} config.text - текст в атрибуте value поля ввода
 * @param {string} config.placeholder - placeholder текст в поле ввода
 * @param {string} config.type - тип поля ввода
 * @param {string} config.leftIcon - путь до иконки, которая будет внутри левой кнопки
 * @param {string} config.leftBtnId - уникальный id левой кнопки
 * @param {string} config.leftBtnText - текст внутри левой кнопки
 * @param {string} config.rightIcon - путь до иконки, которая будет внутри правой кнопки
 * @param {string} config.rightBtnId - уникальный id правой кнопки
 * @param {string} config.rightBtnText - текст внутри правой кнопки
 * @returns {function}
 * @example
 * const searchField = SearchField(this.#elements(), {
 *  id: "search",
 *  placeholder: "Название фильма для поиска",
 *  type: "text",
 *  searchFormId: "navbarsearchform",
 *  rightBtnId: "rightBtn",
 *  rightIcon: searchSvg,
 * });
 */
export const SearchField = (parent, config = {id: ""}) => {
    let _config = Object.assign({}, config);

    if (_config.id === "") {
        _config.id += 'Input';
    }
    const _actions = {};

    const self = () => {
        if ((parent === null) || (parent === undefined)) {
            return;
        }
        return parent.querySelector('#' + _config.id);
    }

    const setActions = (newActions) => {
        for (let action in newActions) {
            _actions[action] = newActions[action];
        }
    }

    const applyActions = () => {
        if (_actions.leftBtn) {
            const btnLeft = self().querySelector('#' + _config.leftBtnId);
            btnLeft.addEventListener("click", _actions.leftBtnId);
        }
        if (_actions.rightBtn) {
            const btnRight = self().querySelector('#' + _config.rightBtnId);
            btnRight.addEventListener("click", _actions.rightBtnId);
        }
    }


    const form = () => {
        if (!self()) {
            throw new Error(`Объект с id="${_config.searchFormId}" не найден на странице`);
        }
        return self().querySelector('#' + _config.searchFormId);
    }

    const destroy = () => {
        if (self()) {
            self().remove();
        }
    }

    const render = () => {
        destroy();

        const inputTempl = Handlebars.templates['search_field.hbs'];

        parent.insertAdjacentHTML("beforeEnd", inputTempl(_config));

        applyActions();
    }

    return {
        self,
        form,
        setActions,
        destroy,
        render,
    }
}

export default SearchField;
