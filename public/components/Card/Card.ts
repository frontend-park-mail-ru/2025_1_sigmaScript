import { createID } from 'utils/createID';
import template from './Card.hbs';
import { router } from 'modules/router';
import { getRatingColor } from 'utils/ratingColor';

export type CardConfig = {
  id?: string;
  previewUrl?: string;
  url?: string;
  title?: string;
  width?: string;
  height?: string;
  text?: string;
  hover?: boolean;
  topText?: string;
  bottomText?: string;
  addClass?: string[];
  rating?: number; // Добавляем поле для рейтинга
};

export class MovieCard {
  #parent: HTMLElement;
  #config: CardConfig;

  /**
   * Карточка с картинкой.
   * @param {HTMLElement} parent - родительский элемент
   * @param {Object} config - конфигурация
   * @param {string} config.id - уникальный id элемента
   * @param {string} config.url - ссылка для перехода
   * @param {string} config.previewUrl - ссылка на изображение
   * @param {string} config.title - заголовок карточки
   * @param {string} config.width - ширина карточки
   * @param {string} config.height - высота карточки
   * @returns {Class}
   * @example
   * new Card(parent, config).render();
   */
  constructor(parent: HTMLElement, config: CardConfig = {}) {
    this.#parent = parent;
    this.#config = {};
    this.#config.id = config.id || 'card--' + createID();
    this.#config.url = config.url || '';
    this.#config.previewUrl = config.previewUrl || '#';
    this.#config.title = config.title || '';
    this.#config.width = config.width || '200';
    this.#config.height = config.height || '300';
    this.#config.hover = config.hover ?? true;
    this.#config.topText = config.topText || '';
    this.#config.bottomText = config.bottomText || '';
    this.#config.addClass = config.addClass;
    this.#config.rating = config.rating;
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
    return this.parentDefined() ? document.getElementById(this.#config.id!) : null;
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    if (!this.self()) {
      return;
    }

    this.#removeActions();
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    if (this.self()) {
      this.destroy();
    }
    const cardHTML = template(this.#config);
    this.#parent.insertAdjacentHTML('beforeend', cardHTML);
    this.self()?.addEventListener('click', (event) => {
      event.preventDefault();
      router.go(this.#config.url!);
    });
    if (this.#config.addClass) {
      for (const cls of this.#config.addClass) {
        this.self()?.classList.add(cls);
      }
    }
    
    // Применяем цвет к фону topText на основе рейтинга, но только если это не календарная карточка
    if (this.#config.rating !== undefined && this.#config.topText !== 'Скоро' && this.#config.topText) {
      const topTextElement = this.self()?.querySelector('.card__top-text');
      if (topTextElement) {
        const color = getRatingColor(this.#config.rating);
        (topTextElement as HTMLElement).style.backgroundColor = color;
        (topTextElement as HTMLElement).style.color = 'white'; // Белый текст для контраста
        (topTextElement as HTMLElement).style.fontWeight = 'bold';
      }
    }
  }

  #removeActions(): void {
    this.self()?.removeEventListener('click', (event) => {
      event.preventDefault();
      router.go(this.#config.url!);
    });
  }
}

export default MovieCard;
