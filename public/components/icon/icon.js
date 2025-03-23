import iconTempl from './icon.hbs';

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
 * const icon = new Icon(document.body, {
 *    src: 'logo.svg',
 *    text: 'Иконка',
 *    textColor: 'primary',
 *    size: 'small',
 *    direction: 'row',
 *    circular: true,
 * });
 */
class Icon {
  #parent;
  #config = {};
  #actions = {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || 'Icon';
    this.#config.srcIcon = config.srcIcon || '';
    this.#config.text = config.text || '';
    this.#config.textColor = config.textColor || 'secondary';
    this.#config.bgColor = config.bgColor || 'none';
    this.#config.size = config.size || '';
    this.#config.direction = config.direction || 'column';
    this.#config.circular = config.circular || false;

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
    if (!this.self()) {
      return;
    }
    for (let action in this.#actions) {
      this.self().addEventListener(action, this.#actions[action]);
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
  changeConfig(newConfig) {
    this.#config = {
      ...this.#config,
      ...newConfig
    };

    if (this.self()) {
      this.render();
    }
  }

  /**
   * Отрисовка иконки
   * @returns
   */
  render() {
    let wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('beforeEnd', iconTempl(this.#config));

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

export default Icon;
