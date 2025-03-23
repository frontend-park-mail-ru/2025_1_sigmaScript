import { createID } from 'utils/createID.js';
import template from './Input.hbs';

export class Input {
  #parent;
  #data;
  #id;

  /**
   * Создаёт новый input.
   * @param {HTMLElement} parent В какой элемент вставлять
   * @param {string} type Тип кнопки.
   * @param {string} name Имя кнопки.
   * @param {string} placeholder Текст кнопки.
   */
  constructor(parent, type, name, placeholder) {
    this.#parent = parent;
    this.#id = 'input--' + createID();
    this.#data = { id: this.#id, type, name, placeholder };
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
   * Проверяет на наличие родителя.
   * @returns {boolean}
   */
  parentDefined() {
    return !(this.#parent === null || this.#parent === undefined);
  }

  /**
   * Возвращает DOM элемент ошибки
   * @returns {HTMLElement}
   */
  getErrorContainer() {
    return this.self()?.querySelector('.input__error-container');
  }

  /**
   * Возвращает DOM элемент поля ввода
   * @returns {HTMLElement}
   */
  getInput() {
    return this.self()?.querySelector('.input');
  }

  /**
   * Очищает поле ввода
   */
  clearInput() {
    if (this.parentDefined()) {
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
