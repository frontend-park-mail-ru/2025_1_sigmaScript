import { createID } from 'utils/createID';
import template from './MovieCarousel.hbs';
import { router } from 'modules/router';
import { MovieCollection } from 'types/main_page.types';

export type CarouselConfig = {
  id?: string;
  movies: MovieCollection;
  interval?: number;
};

export class MovieCarousel {
  #parent: HTMLElement;
  #config: CarouselConfig = {
    id: createID(),
    movies: [],
    interval: 15000
  };
  #currentIndex: number;
  #timerId: ReturnType<typeof setInterval> | null = null;

  #linkElement: HTMLAnchorElement | null = null;
  #imageElement: HTMLImageElement | null = null;
  #prevButton: HTMLButtonElement | null = null;
  #nextButton: HTMLButtonElement | null = null;
  #aboutButton: HTMLButtonElement | null = null;

  /**
   * Компонент карусели для превью фильмов.
   * @param {HTMLElement} parent - Родительский элемент.
   * @param {CarouselConfig} config - Конфигурация карусели.
   * @param {MovieCollection} config.movies - ОБЪЕКТ данных о фильмах.
   * @param {string} config.id - Уникальный ID для корневого элемента.
   * @param {number} config.interval - Интервал автопрокрутки в мс.
   */
  constructor(parent: HTMLElement, config: CarouselConfig) {
    this.#parent = parent;
    this.#config.id = config.id || this.#config.id;
    this.#config.movies = config.movies || this.#config.movies;
    this.#config.interval = config.interval || this.#config.interval;
    this.#currentIndex = 0;

    this.#config.movies = this.#config.movies ? Object.values(this.#config.movies) : [];
  }

  parentDefined(): boolean {
    return !!this.#parent;
  }

  self(): HTMLElement | null {
    return this.parentDefined() ? document.getElementById(this.#config.id!) : null;
  }

  destroy(): void {
    this.#stopAutoPlay();
    this.#removeActions();
    this.self()?.remove();
    this.#linkElement = null;
    this.#imageElement = null;
    this.#prevButton = null;
    this.#nextButton = null;
    this.#aboutButton = null;
  }

  render(): void {
    if (!this.parentDefined()) {
      return;
    }

    if (this.self()) {
      this.destroy();
    }

    const hasMovies = this.#config.movies.length > 0;
    const initialMovie = hasMovies ? this.#config.movies[0] : null;

    const context = {
      id: this.#config.id,
      title: initialMovie?.title || 'Нет названия',
      year: initialMovie?.releaseDate || 'Нет данных',
      duration: initialMovie?.duration || '0',
      hasMovies: hasMovies,
      initialPreviewUrl: initialMovie?.previewUrl || '',
      initialTitle: initialMovie?.title || 'Нет данных',
      initialUrl: initialMovie ? `/movie/${initialMovie.id}` : ''
    };

    const carouselHTML = template(context);
    this.#parent.insertAdjacentHTML('beforeend', carouselHTML);

    if (hasMovies) {
      this.#cacheElements();
      this.#addActions();
      this.#startAutoPlay();
    }
  }

  #cacheElements(): void {
    const selfElement = this.self();
    if (!selfElement) return;

    this.#linkElement = selfElement.querySelector('.movie-carousel__link');
    this.#imageElement = selfElement.querySelector('.movie-carousel__image');
    this.#prevButton = selfElement.querySelector('.movie-carousel__arrow--prev');
    this.#nextButton = selfElement.querySelector('.movie-carousel__arrow--next');
    this.#aboutButton = selfElement.querySelector('.movie-carousel__about');
  }

  #addActions(): void {
    this.#prevButton?.addEventListener('click', this.#handlePrevClick);
    this.#nextButton?.addEventListener('click', this.#handleNextClick);
    this.#aboutButton?.addEventListener('click', this.#handleImageClick);
    this.#linkElement?.addEventListener('click', this.#handleImageClick);

    // TODO спросить по ux, нужно ли останавливать прокрутку при наведении
    // this.self()?.addEventListener('mouseenter', this.#stopAutoPlay);
    // this.self()?.addEventListener('mouseleave', this.#startAutoPlay);
  }

  #removeActions(): void {
    this.#prevButton?.removeEventListener('click', this.#handlePrevClick);
    this.#nextButton?.removeEventListener('click', this.#handleNextClick);
    this.#linkElement?.removeEventListener('click', this.#handleImageClick);
    this.self()?.removeEventListener('mouseenter', this.#stopAutoPlay);
    this.self()?.removeEventListener('mouseleave', this.#startAutoPlay);
  }

  #handlePrevClick = (event: MouseEvent): void => {
    if (this.#prevButton?.classList.contains('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.#resetAutoPlay();
    this.#showSlide(this.#getPrevIndex());
  };

  #handleNextClick = (event: MouseEvent): void => {
    if (this.#nextButton?.classList.contains('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.#resetAutoPlay();
    this.#showSlide(this.#getNextIndex());
  };

  #handleImageClick = (event: Event): void => {
    event.preventDefault();
    router.go(`/movie/${this.#config.movies[this.#currentIndex].id}`);
  };

  #getPrevIndex(): number {
    if (this.#config.movies.length === 0) return 0;
    return (this.#currentIndex - 1 + this.#config.movies.length) % this.#config.movies.length;
  }

  #getNextIndex(): number {
    if (this.#config.movies.length === 0) return 0;
    return (this.#currentIndex + 1) % this.#config.movies.length;
  }

  #showSlide(index: number): void {
    if (!this.#config.movies[index] || !this.#imageElement || !this.#linkElement) {
      return;
    }

    this.#prevButton?.classList.add('disabled');
    this.#nextButton?.classList.add('disabled');

    this.#currentIndex = index;
    const movie = this.#config.movies[this.#currentIndex];
    const imageUrl = movie.previewUrl;
    const imageAlt = movie.title;
    const linkUrl = `/movie/${movie.id}`;

    this.#imageElement.classList.add('movie-carousel__image--fading');

    setTimeout(() => {
      if (!this.#imageElement || !this.#linkElement) return;

      this.#imageElement.src = imageUrl;
      this.#imageElement.alt = imageAlt;
      this.#linkElement.href = linkUrl;

      this.#imageElement?.classList.remove('movie-carousel__image--fading');

      this.#prevButton?.classList.remove('disabled');
      this.#nextButton?.classList.remove('disabled');
    }, 700);
  }

  #startAutoPlay = (): void => {
    if (this.#config.movies.length <= 1 || this.#timerId !== null) {
      return;
    }
    this.#timerId = setInterval(() => {
      this.#showSlide(this.#getNextIndex());
    }, this.#config.interval);
  };

  #stopAutoPlay = (): void => {
    if (this.#timerId !== null) {
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  };

  #resetAutoPlay = (): void => {
    this.#stopAutoPlay();
    this.#startAutoPlay();
  };
}

export default MovieCarousel;
