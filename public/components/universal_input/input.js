import inputTempl from './input.hbs';

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
 * @param {Object} config.actions - события элемента
 * @returns {function}
 * @example
 * const input = new Input(parent, {
 *  id: "search",
 *  placeholder: "введите имя",
 *  type: "text",
 * });
 */
class Input {
  #parent;
  #config = {};
  #actions = {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || 'Input';
    this.#config.inputClasses = config.inputClasses || '';
    this.#config.inputFieldId = config.inputFieldId || 'InputField';
    this.#config.text = config.text || '';
    this.#config.placeholder = config.placeholder || '';
    this.#config.type = config.type || '';

    this.#actions = config.actions;
  }

  self() {
    if (!this.#parent) {
      return;
    }
    return this.#parent.querySelector('#' + this.#config.id);
  }

  setActions(newActions) {
    for (let action in newActions) {
      this.#actions[action] = newActions[action];
    }
  }

  #applyActions() {
    if (!this.self()) {
      return;
    }

    if (this.#actions.keypress) {
      this.self().addEventListeneraddEventListener('keypress', this.#actions.keypress);
    }
  }

  field() {
    if (!this.self()) {
      throw new Error(`Объект с id="${this.#config.inputFieldId}" не найден на странице`);
    }
    return this.self().querySelector('#' + this.#config.inputFieldId);
  }

  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }

  render() {
    let wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('beforeEnd', inputTempl(this.#config));

    const input = wrapper.firstElementChild;
    wrapper.remove();

    if (this.self()) {
      this.self().replaceWith(input);
    } else {
      this.#parent.insertAdjacentElement('beforeEnd', input);
    }
    this.#applyActions();
  }
}

export default Input;
