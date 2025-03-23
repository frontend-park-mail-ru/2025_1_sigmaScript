import inputTempl from './search_field.hbs';

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
 * @param {Object} config.actions - события элемента
 * @returns {Class}
 * @example
 * const searchField = new SearchField(this.#elements(), {
 *  id: "search",
 *  placeholder: "Название фильма для поиска",
 *  type: "text",
 *  searchFormId: "navbarsearchform",
 *  rightBtnId: "rightBtn",
 *  rightIcon: searchSvg,
 * });
 */
class SearchField {
  #parent;
  #config = {};
  #actions = {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config = Object.assign({}, config);

    if (this.#config.id === '') {
      this.#config.id = 'Input';
    }

    this.#actions = config.actions || {};
  }

  self() {
    if (this.#parent) {
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
    if (this.#actions.leftBtn) {
      const btnLeft = this.self().querySelector('#' + this.#config.leftBtnId);
      btnLeft.addEventListener('click', this.#actions.leftBtn);
    }
    if (this.#actions.rightBtn) {
      const btnRight = this.self().querySelector('#' + this.#config.rightBtnId);
      btnRight.addEventListener('click', this.#actions.rightBtn);
    }
  }

  form() {
    if (!this.self()) {
      throw new Error(`Объект с id="${this.#config.searchFormId}" не найден на странице`);
    }
    return this.self().querySelector('#' + this.#config.searchFormId);
  }

  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }

  render() {
    let wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('beforeEnd', inputTempl(this.#config));

    const icon = wrapper.firstElementChild;
    wrapper.remove();

    if (this.self()) {
      this.self().replaceWith(icon);
    } else {
      this.#parent.insertAdjacentElement('beforeEnd', icon);
    }
    this.#applyActions();
  }
}

export default SearchField;
