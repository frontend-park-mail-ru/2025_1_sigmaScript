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
  #addClasses = [];

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || 'Input';
    this.#config.name = config.name || 'noname';
    this.#config.inputClasses = config.inputClasses || '';
    this.#config.text = config.text || '';
    this.#config.placeholder = config.placeholder || '';
    this.#config.type = config.type || '';

    this.#actions = config.actions || {};
    this.#addClasses = config.addClasses || [];
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
      this.getInput().addEventListeneraddEventListener('keypress', this.#actions.keypress);
    }
  }

  #applyClasses() {
    if (this.self()) {
      this.#addClasses.forEach((cls) => {
        this.self().classList.add(cls);
      }, this);
    }
  }

  /**
   * Возвращает DOM элемент ошибки
   * @returns {HTMLElement}
   */
  getErrorContainer() {
    return this.self()?.querySelector('.u_input__error-container');
  }

  /**
   * Возвращает DOM элемент поля ввода
   * @returns {HTMLElement}
   */
  getInput() {
    return this.self()?.querySelector('.u_input__field');
  }

  /**
   * Очищает поле ввода
   */
  clearInput() {
    if (this.#parent) {
      this.getInput().value = '';
    }
  }

  /**
   * Возвращает значение из поля ввода
   * @returns {string}
   */
  getValue() {
    return this.getInput()?.value;
  }
  /**
   * Задаем родителя.
   */
  setParent(newParent) {
    this.#parent = newParent;
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
    this.#applyClasses();
  }
}

export default Input;
