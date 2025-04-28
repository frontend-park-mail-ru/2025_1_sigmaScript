import { createID } from 'utils/createID';
import template from './button.hbs';

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
  #addClasses = [];
  #parent;

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id + createID() || 'btn' + createID();
    this.#config.color = config.color || 'primary';
    this.#config.disabled = config.disabled || false;
    this.#config.form = config.form;
    this.#config.srcIcon = config.srcIcon;
    this.#config.text = config.text;
    this.#config.textColor = config.textColor || 'primary';
    this.#config.autofocus = config.autofocus || false;

    this.#actions = config.actions || {};
    this.#addClasses = config.addClasses || [];
  }

  self() {
    if (!this.#parent) {
      return;
    }
    return this.#parent.querySelector('#' + this.#config.id);
  }

  setText(text) {
    if (this.self()) {
      this.self().getElementsByTagName('span')[0].textContent = text;
    }
  }

  destroy() {
    if (!this.self()) {
      return;
    }

    for (let action in this.#actions) {
      this.self().removeEventListener(action, this.#actions[action]);
    }

    this.self().remove();
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

  #applyClasses() {
    if (this.self()) {
      this.#addClasses.forEach((cls) => {
        this.self().classList.add(cls);
      }, this);
    }
  }

  /**
   * Делает кнопку недоступной
   */
  disable() {
    if (this.#parent) {
      this.self().classList.add('disable');
      this.self().disabled = true;
    }
  }

  /**
   * Делает кнопку доступной
   */
  enable() {
    if (this.#parent) {
      this.self().classList.remove('disable');
      this.self().disabled = false;
    }
  }

  render() {
    if (!this.#parent) {
      return;
    }

    let wrapper = document.createElement('div');
    wrapper.insertAdjacentHTML('beforeEnd', template(this.#config));

    const btn = wrapper.firstElementChild;
    wrapper.remove();

    if (this.self()) {
      this.self().replaceWith(btn);
    } else {
      this.#parent.insertAdjacentElement('beforeEnd', btn);
    }
    this.#applyActions();
    this.#applyClasses();
  }
}

export default Button;
