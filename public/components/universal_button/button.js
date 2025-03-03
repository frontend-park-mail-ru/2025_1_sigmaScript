/**
 * Обычная кнопка
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - уникальный id элемента
 * @param {string} config.color - цвет содержимого кнопки
 * @param {boolean} config.disabled - флаг, что кнопка disabled
 * @param {string} config.form - форма, которая отправляется при нажатии кнопки.
 * Кнопка автоматически становится типа submit
 * @param {string} config.srcIcon - путь до иконки, которая будет внутри кнопки
 * @param {string} config.text - текст кнопки
 * @param {string} config.textColor - класс текста кнопки
 * @param {boolean} config.autofocus - автофокус на кнопку
 * @param {Object} config.actions - события кнопки
 * @returns {Class}
 * @example
 * const icon = new Button(parent, {
 * id: "create",
 * type: "button",
 * text: "Создать",
 * color: "primary",
 * textColor: "primary",
 * });
 */
class Button {
    #config = {};
    #actions = {};
    #parent;

    constructor(parent, config) {
        this.#parent = parent;

        this.#config.id = config.id || 'btn';
        this.#config.color = config.color || 'primary';
        this.#config.disabled = config.disabled || false;
        this.#config.form = config.form || '';
        this.#config.srcIcon = config.srcIcon || '';
        this.#config.text = config.text || '';
        this.#config.textColor = config.textColor || 'primary';
        this.#config.autofocus = config.autofocus || false;

        this.#actions = config.actions || {};
    }

    self() {
        if (!this.#parent) {
            return;
        }
        return this.#parent.querySelector('#' + this.#config.id);
    }

    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    setActions(newActions) {
        for (let action in newActions) {
            this.#actions[action] = newActions[action];
        }
    }

    #applyActions() {
        if (this.self()) {
            for (let action in this.#actions) {
                this.self().addEventListener(action, this.#actions[action]);
            }
        }
    }

    render() {
        let wrapper = document.createElement('div');
        // eslint-disable-next-line no-undef
        const btnTempl = Handlebars.templates['button.hbs'];
        wrapper.insertAdjacentHTML('beforeEnd', btnTempl(this.#config));

        const btn = wrapper.firstElementChild;
        wrapper.remove();

        if (self()) {
            self().replaceWith(btn);
        } else {
            this.#parent.insertAdjacentElement('beforeEnd', btn);
        }
        this.#applyActions();
    }
}

export default Button;
