import { FooterData } from 'types/Footer.types';
import { createID } from 'utils/createID.js';
import template from './Footer.hbs';

export class Footer {
  #parent: HTMLElement;
  #data: FooterData;
  #id: string;

  /**
   * Создаёт новый footer.
   * @param {HTMLElement} parent - Куда вставлять
   * @param {Object} data - Данные для шаблона
   * @param {Array<Object>} data.columns - Колонки с меню.
   * @param {string} data.columns[].title - Заголовок колонки.
   * @param {Array<Object>} data.columns[].links - Ссылки в колонке.
   * @param {string} data.columns[].links[].text - Текст ссылки.
   * @param {string} data.columns[].links[].url - URL ссылки.
   * @param {string} data.copyright - Текст копирайта.
   * @param {string} data.bottomText - Дополнительный текст.
   * @param {Array<Object>} data.bottomLinks - Ссылки в нижней части футера.
   * @param {string} data.bottomLinks[].text - Текст ссылки.
   * @param {string} data.bottomLinks[].url - URL ссылки.
   */
  constructor(parent: HTMLElement, data: FooterData = {}) {
    this.#parent = parent;
    this.#data = data;
    this.#id = 'footer--' + createID();
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
    return this.#parent != null;
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
    const mergedData: FooterData = {
      columns: this.#data.columns || [],
      copyright: this.#data.copyright || '© 2025 sigmaScript',
      bottomLinks: this.#data.bottomLinks || [],
      bottomText: this.#data.bottomText || '',
      id: this.#id
    };

    this.#parent.insertAdjacentHTML('beforeend', template(mergedData));

    this.self()
      ?.querySelectorAll<HTMLAnchorElement>('.footer__link')
      .forEach((link) => {
        link.addEventListener('click', (e: Event) => this.handleLinkClick(e));
      });
  }

  /**
   * Обрабтчик клика
   * @param {Event} event - Событие клика.
   */
  private handleLinkClick(event: Event): void {
    const target = event.target as HTMLAnchorElement;
    const url = target.getAttribute('href');

    if (url && this.isInternalLink(url)) {
      event.preventDefault();
      // TODO: goToPage
    }
  }

  /**
   * Проверяет, является ли ссылка внутренней
   * @param {string} url - URL для проверки.
   * @returns {boolean} - `true`, если ссылка внутренняя, иначе `false`.
   */
  private isInternalLink(url: string): boolean {
    try {
      const linkHostname = new URL(url, window.location.origin).hostname;
      return linkHostname === window.location.hostname;
    } catch {
      return false;
    }
  }
}
