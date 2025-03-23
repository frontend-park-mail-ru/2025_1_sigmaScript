import { createID } from 'utils/createID.js';
import template from './Button.hbs';

export class Button {
  #parent;
  #data;
  #id;

  /**
   * Создаёт новый Button.
   * @param {HTMLElement} parent В какой элемент вставлять
   * @param {string} type Тип кнопки.
   * @param {string} text Текст кнопки.
   */
  constructor(parent, type, text) {
    this.#parent = parent;
    this.#id = 'button--' + createID();
    this.#data = { id: this.#id, type, text };
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent() {
    return this.#parent;
  }

  /**
   * Возвращает данные шаблона.
   * @returns {Object}
   */
  get data() {
    return this.#data;
  }

  /**
   * Задаем родителя.
   */
  setParent(newParent) {
    this.#parent = newParent;
  }

  /**
   * Проверяет на наличие родителя.
   * @returns {boolean}
   */
  parentDefined() {
    return !(this.#parent === null || this.#parent === undefined);
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self() {
    if (this.parentDefined()) {
      return document.getElementById(this.#id);
    }
  }

  /**
   * Делает кнопку недоступной
   */
  disable() {
    if (this.parentDefined()) {
      this.self().classList.add('disable');
      this.self().disabled = true;
    }
  }

  /**
   * Делает кнопку доступной
   */
  enable() {
    if (this.parentDefined()) {
      this.self().classList.remove('disable');
      this.self().disabled = false;
    }
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }

  /**
   * Рисует компонент на экран.
   */
  render() {
    this.destroy();
    if (!this.parentDefined) {
      return;
    }

    this.#parent.innerHTML += template(this.#data);
  }
}
