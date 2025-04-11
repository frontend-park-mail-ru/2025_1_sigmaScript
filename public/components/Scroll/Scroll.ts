import { createID } from 'utils/createID';
import template from './Scroll.hbs';

export class Scroll {
  #parent: HTMLElement;
  #id: string;

  /**
   * Скролл (горизонтальный контейнер с прокруткой).
   * @param {HTMLElement} parent - родительский элемент
   * @param {string} id - уникальный id элемента
   * @returns {Class}
   * @example
   * const scroll = new Scroll(parent).render();
   * scroll.getContentContainer(); // !!!!
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = createID();
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Задаем родителя.
   */
  set parent(newParent: HTMLElement) {
    this.#parent = newParent;
  }

  /**
   * Проверяет на наличие родителя.
   * @returns {boolean}
   */
  parentDefined(): boolean {
    return !!this.#parent;
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    return this.parentDefined() ? document.getElementById(this.#id) : null;
  }

  /**
   * Возвращает контейнер с главным содержимым.
   */
  getContentContainer(): HTMLElement | null | undefined {
    return this.self()?.querySelector('.scroll__content');
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    if (this.self()) {
      this.destroy();
    }
    this.#parent.innerHTML += template({ id: this.#id });
  }
}

export default Scroll;
