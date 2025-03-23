import { createID } from 'utils/createID.js';
import template from './Footer.hbs';

export class Footer {
  #parent;
  #data;
  #id;

  /**
   * Создаёт новый footer.
   * @param {HTMLElement} parent - Куда вставлять
   * @param {Object} data - Данные для шаблона
   * @param {string} data.id - Уникальный идентификатор футера.
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
  constructor(parent, data = {}) {
    this.#parent = parent;
    this.#data = data;
    this.#id = 'footer--' + createID();
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent() {
    return this.#parent;
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
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render() {
    const mergedData = {
      columns: this.#data.columns || [],
      copyright: this.#data.copyright || '© 2025 sigmaScript',
      bottomLinks: this.#data.bottomLinks || [],
      bottomText: this.#data.bottomText || '',
      id: this.#id
    };

    this.#parent.insertAdjacentHTML('beforeend', template(mergedData));

    this.self()
      ?.querySelectorAll('.footer__link')
      .forEach((link) => {
        link.addEventListener('click', (e) => this.handleLinkClick(e));
      });
  }

  /**
   * Обрабтчик клика
   * @param {Event} event - Событие клика.
   */
  handleLinkClick(event) {
    const url = event.target.getAttribute('href');

    if (this.isInternalLink(url)) {
      event.preventDefault();
      // TODO: goToPage
    }
  }

  /**
   * Проверяет, является ли ссылка внутренней
   * @param {string} url - URL для проверки.
   * @returns {boolean} - `true`, если ссылка внутренняя, иначе `false`.
   */
  isInternalLink(url) {
    try {
      const linkHostname = new URL(url, window.location.origin).hostname;
      return linkHostname === window.location.hostname;
    } catch {
      return false;
    }
  }
}
