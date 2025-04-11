import { createID } from 'utils/createID';
import template from './Stars.hbs';

type StarsConfig = {
  id?: string;
  starsRange?: number[];
  initialRating?: number;
};

export class Stars {
  #parent: HTMLElement;
  #config: StarsConfig;

  #currentRating: number;
  #hoverRating: number = 0;
  #starsContainer: HTMLElement | null = null;
  #stars: NodeListOf<SVGElement> | null = null;
  #rating: HTMLElement | null = null;

  /**
   * Звезды рейтинга.
   * @param {HTMLElement} parent - родительский элемент
   * @param {StarsConfig} config - конфигурация
   * @param {string} config.id - уникальный id элемента
   * @param {number[]} config.starsRange - количество (значения) звезд
   * @param {number} config.initialRating - начальный рейтинг
   * @returns {Stars}
   * @example
   * new Stars(parent, config).render();
   */
  constructor(parent: HTMLElement, config: StarsConfig = {}) {
    this.#parent = parent;
    this.#config = {
      id: config.id || createID(),
      starsRange: config.starsRange || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      initialRating: config.initialRating || 0
    };
    this.#currentRating = this.#config.initialRating!;
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
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    return document.getElementById(this.#config.id!);
  }

  /**
   * Возвращает цвет звезд при заданном рейтинге.
   * @param {number} rating - рейтинг
   * @returns {string}
   */
  #getRatingColor(rating: number): string {
    if (rating <= 0) return '#ccc';
    if (rating <= 1) return '#8c0d04';
    if (rating <= 2) return '#fa2c15';
    if (rating <= 3) return '#fa5615';
    if (rating <= 4) return '#fa9e15';
    if (rating <= 5) return '#fab115';
    if (rating <= 6) return '#facc15';
    if (rating <= 7) return '#a6fa15';
    if (rating <= 8) return '#41c42d';
    if (rating <= 9) return '#168c04';
    if (rating <= 10) return '#136602';
    return '#ccc';
  }

  /**
   * Обработчик наведения курсора мыши.
   * @param {MouseEvent} event - событие мыши
   */
  #handleMouseMove = (event: MouseEvent): void => {
    if (event.target instanceof Element) {
      const star = event.target.closest<SVGElement>('.js-star');
      if (!star || !this.#starsContainer?.contains(star)) return;
      const value = parseInt(star.dataset.value || '0', 10);
      if (!isNaN(value)) {
        this.#hoverRating = value;
        this.#updateDisplay(this.#hoverRating);
      }
    }
  };

  /**
   * Обработчик потери курсора мыши.
   */
  #handleMouseLeave = (): void => {
    this.#hoverRating = 0;
    this.#updateDisplay(this.#currentRating);
  };

  /**
   * Обработчик нажатия на звезду.
   * @param {MouseEvent} event - событие мыши
   */
  #handleClick = (event: MouseEvent): void => {
    if (event.target instanceof Element) {
      const star = event.target.closest<SVGElement>('.js-star');
      if (!star || !this.#starsContainer?.contains(star)) return;

      const clickedRating = parseInt(star.dataset.value || '0', 10);
      if (!isNaN(clickedRating)) {
        this.#currentRating = clickedRating;
        this.self()?.setAttribute('data-rating', this.#currentRating.toString());
        this.#updateDisplay(this.#currentRating);
      }
    }
  };

  /**
   * Обновление рисовки звезд.
   * @param {number} rating - рейтинг
   */
  #updateDisplay(rating: number): void {
    if (!this.#stars || !this.#rating) return;

    const activeColor = this.#getRatingColor(rating);

    this.#stars.forEach((star: SVGElement) => {
      const starValue = parseInt(star.dataset.value || '0', 10);
      if (isNaN(starValue)) return;
      const isColored = starValue <= rating;
      if (isColored) {
        star.style.fill = activeColor;
        star.classList.add('stars__star_highlighted');
      } else {
        star.style.fill = '#ccc';
        star.classList.remove('stars__star_highlighted');
      }
    });

    this.#rating.textContent = rating > 0 ? rating.toString() : '–';
  }

  /**
   * Функция применения обработчиков.
   */
  #attachEventListeners(): void {
    const starsElement = this.self();
    if (!starsElement) return;

    this.#starsContainer = starsElement.querySelector<HTMLDivElement>('.js-stars-container');
    this.#stars = starsElement.querySelectorAll<SVGElement>('.js-star');
    this.#rating = starsElement.querySelector<HTMLSpanElement>('.js-stars-rating');

    if (!this.#starsContainer || !this.#rating || !this.#stars) return;

    this.#starsContainer.addEventListener('mousemove', this.#handleMouseMove);
    this.#starsContainer.addEventListener('mouseleave', this.#handleMouseLeave);
    this.#starsContainer.addEventListener('click', this.#handleClick);
  }

  /**
   * Функция удаления обработчиков.
   */
  #removeEventListeners(): void {
    if (this.#starsContainer) {
      this.#starsContainer.removeEventListener('mousemove', this.#handleMouseMove);
      this.#starsContainer.removeEventListener('mouseleave', this.#handleMouseLeave);
      this.#starsContainer.removeEventListener('click', this.#handleClick);
    }
  }

  /**
   * Удаляет отрисованные элементы и слушатели событий.
   */
  destroy(): void {
    this.#removeEventListeners();
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран и навешивает события.
   */
  render(): void {
    if (this.self()) {
      this.destroy();
    }
    this.#parent.insertAdjacentHTML('beforeend', template(this.#config));
    this.#attachEventListeners();
    this.#updateDisplay(this.#currentRating);
  }
}

export default Stars;
