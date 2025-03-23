import { createID } from 'utils/createID.js';
import template from './Switch.hbs';

export class Switch {
  #parent;
  #data;
  #id;

  /**
   * Создаёт новый switch.
   * @param {HTMLElement} parent В какой элемент вставлять
   * @param {string} leftButtonText Текст левой кнопки.
   * @param {string} rightButtonText Текст правой кнопки.
   */
  constructor(parent, leftButtonText, rightButtonText) {
    this.#parent = parent;
    this.#id = 'switch--' + createID();
    this.#data = { id: this.#id, leftButtonText, rightButtonText };
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
    if (!this.parentDefined()) {
      return;
    }

    this.#parent.innerHTML += template(this.#data);
  }
}
