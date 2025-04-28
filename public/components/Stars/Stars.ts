import { createID } from 'utils/createID';
import template from './Stars.hbs';
import DOMPurify from 'dompurify';

type StarsElement = {
  sign: string | number;
  svg: string;
};

type StarsConfig = {
  id?: string;
  starsRange?: StarsElement[];
  initialRating?: number;
  withInfo?: boolean;
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
    const defaultStarSVG: string = `<svg viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;
    this.#parent = parent;
    this.#config = {
      id: config.id || createID(),
      starsRange:
        this.#sanitizeSVG(config.starsRange) ||
        this.#sanitizeSVG([
          { sign: 1, svg: defaultStarSVG },
          { sign: 2, svg: defaultStarSVG },
          { sign: 3, svg: defaultStarSVG },
          { sign: 4, svg: defaultStarSVG },
          { sign: 5, svg: defaultStarSVG },
          { sign: 6, svg: defaultStarSVG },
          { sign: 7, svg: defaultStarSVG },
          { sign: 8, svg: defaultStarSVG },
          { sign: 9, svg: defaultStarSVG },
          { sign: 10, svg: defaultStarSVG }
        ]),
      initialRating: config.initialRating || config.initialRating === 0 ? config.initialRating : 5,
      withInfo: config.withInfo === false ? false : true
    };
    this.#currentRating = this.#config.initialRating!;
  }

  #sanitizeSVG(elements: StarsElement[] | undefined): StarsElement[] | undefined {
    if (!elements) {
      return undefined;
    }
    let sanitizedElems: StarsElement[] = [];
    for (const element of elements) {
      sanitizedElems.push({ sign: element.sign, svg: DOMPurify.sanitize(element.svg) });
    }
    return sanitizedElems;
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
   * Возвращает текущий рейтинг.
   * @returns {number}
   */
  get currentRating(): number {
    return this.#currentRating;
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

    if (this.#config.withInfo) {
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

      this.#rating.textContent = rating > 0 ? rating.toString() : '0';
    } else {
      this.#stars.forEach((star: SVGElement) => {
        const starValue = parseInt(star.dataset.value || '0', 10);
        if (isNaN(starValue)) return;
        const isColored = starValue === rating;
        if (isColored) {
          star.classList.add('stars__star_highlighted', 'stars__NPS_highlighted');
        } else {
          star.classList.remove('stars__star_highlighted', 'stars__NPS_highlighted');
        }
      });
    }
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

export function getNPS(parent: HTMLElement): Stars {
  const SVG = [];
  for (let i = 1; i <= 10; i++) {
    const sign = i;
    const svg = `<div class="stars__NPS-element">${i}</div>`;
    SVG.push({ sign: sign, svg: svg });
  }
  return new Stars(parent, { starsRange: SVG, initialRating: 0, withInfo: false });
}
