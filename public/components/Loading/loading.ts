import { createID } from 'utils/createID';
import template from './loading.hbs';

export class Loading {
  #parent: HTMLElement;
  #id: string;

  /**
   * Скролл (горизонтальный контейнер с прокруткой).
   * @param {HTMLElement} parent - родительский элемент
   * @param {string} id - уникальный id элемента
   * @returns {Class}
   * @example
   * const scroll = new Scroll(parent).render();
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = createID();
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

export default Loading;
