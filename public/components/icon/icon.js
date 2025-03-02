
/**
 * Иконка с текстом
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - id иконки
 * @param {string} config.src - путь до иконки
 * @param {string} config.text - текст иконки
 * @param {string} config.textColor - цвет текста иконки
 * @param {string} config.bgColor - размер иконки
 * @param {string} config.size - размер иконки
 * @param {string} config.link - ссылка на страницу
 * @param {string} config.direction - направление иконки
 * @param {boolean} config.circular - круглая иконка
 * @param {Object} config.actions - события иконки
 * @returns 
 * @example
 * const icon = Icon(document.body, {
 *    src: 'logo.svg',
 *    text: 'Иконка',
 *    textColor: 'primary',
 *    size: 'small',
 *    direction: 'row',
 *    circular: true,
 * });
 */
export const Icon = (parent, config) => {
    let _config = {};

    _config.id = config.id || "Icon";
    _config.srcIcon = config.srcIcon || "";
    _config.text = config.text || "";
    _config.textColor = config.textColor || "secondary";
    _config.bgColor = config.bgColor || "none";
    _config.size = config.size || "";
    _config.direction = config.direction || "column";
    _config.circular = config.circular || false;

    const _actions = config.actions || {};

    const self = () => {
        return parent.querySelector('#' + _config.id);
    }

    const destroy = () => {
        if (self()) {
            self().remove();
        }
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
        for (let action in _actions) {
            self().addEventListener(action, _actions[action]);
        }
    }

    /**
     * Измение конфигурации иконки и перерисовка, если иконка уже отрисована
     * @param {HTMLElement} parent - родительский элемент
     * @param {Object} config - конфигурация
     * @param {string} config.id - id иконки
     * @param {string} config.src - путь до иконки
     * @param {string} config.text - текст иконки
     * @param {string} config.textColor - цвет текста иконки
     * @param {string} config.bgColor - размер иконки
     * @param {string} config.size - размер иконки
     * @param {string} config.link - ссылка на страницу
     * @param {string} config.direction - направление иконки
     * @param {boolean} config.invert - инвертировать цвет иконки
     * @param {boolean} config.circular - круглая иконка
     * @param {Object} config.action - события иконки
     * @returns
     * @example
     * icon.changeConfig({
     *    src: 'path/to/icon',
     *    text: 'text',
     *    textColor: 'primary',
     * });
     */
    const changeConfig = (newConfig) => {
        _config = {
            ..._config,
            ...newConfig,
        };

        if (self()) {
            render();
        }
    }

    /**
     * Отрисовка иконки
     * @returns
    */
    const render = () => {
        const wrapper = document.createElement('div');
        wrapper.classList.add("wrapper");
        const iconTempl = Handlebars.templates['icon.hbs'];
        wrapper.insertAdjacentHTML("beforeEnd", iconTempl(_config));
        
        
        if (self()) {
            self().replaceWith(wrapper);
        } else {
            parent.insertAdjacentElement("beforeEnd", wrapper);
        }

        applyActions();
    }

    return {
        self,
        destroy,
        setActions,
        changeConfig,
        render,
    };
}
