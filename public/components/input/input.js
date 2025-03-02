
/**
 * Элемент поля ввода
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - уникальный id элемента
 * @param {string} config.inputClasses - классы поля ввода
 * @param {string} config.inputFieldId - уникальный id поля ввода
 * @param {string} config.text - текст в атрибуте value поля ввода
 * @param {string} config.placeholder - placeholder текст в поле ввода
 * @param {string} config.type - тип поля ввода
 * @returns {function}
 * @example
 * const input = Input(parent, {
 *  id: "search",
 *  placeholder: "введите имя",
 *  type: "text",
 * });
 */
export const Input = (parent, config = {id: ""}) => {
    let _config = Object.assign({}, config);
    _config.id += 'Input';
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
        if (!self()) {
            return;
        }

        if (_actions.keypress) {
            self().addEventListeneraddEventListener('keypress', _actions.keypress);            
        }
    }


    const field = () => {
        if (!self()) {
            throw new Error(`Объект с id="${_config.inputFieldId}" не найден на странице`);
        }
        return self().querySelector('#' + _config.inputFieldId);
    }

    const destroy = () => {
        if (self()) {
            self().remove();
        }
    }

    const render = () => {
        destroy();

        const inputTempl = Handlebars.templates['input.hbs'];

        parent.insertAdjacentHTML("beforeEnd", inputTempl(_config));

        applyActions();
    }

    return {
        self,
        field,
        setActions,
        destroy,
        render,
    }
}

export default Input;
