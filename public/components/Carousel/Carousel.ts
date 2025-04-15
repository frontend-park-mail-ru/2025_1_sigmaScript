import MovieCard, { CardConfig } from 'components/Card/Card';
import template from './Carousel.hbs';
import './Carousel.css';

type CarouselConfig = {
  cardsData: CardConfig[];
};

export class CardCarousel {
  #parent: HTMLElement;
  #config: CarouselConfig;
  #cards: MovieCard[] = [];
  #currentIndex: number = 0;
  #carouselContainer: HTMLElement | null = null;
  #prevButton: HTMLButtonElement | null = null;
  #nextButton: HTMLButtonElement | null = null;

  constructor(parent: HTMLElement, config: CarouselConfig) {
    this.#parent = parent;
    this.#config = config;
  }

  render(): void {
    const carouselHTML = template({
      cards: this.#config.cardsData.map((data) => ({ id: `card-${data.id}`, ...data }))
    });
    this.#parent.innerHTML = carouselHTML;

    this.#carouselContainer = this.#parent.querySelector('.card-carousel__container');
    this.#prevButton = this.#parent.querySelector('.card-carousel__button--prev');
    this.#nextButton = this.#parent.querySelector('.card-carousel__button--next');

    if (this.#carouselContainer && this.#prevButton && this.#nextButton) {
      this.#config.cardsData.forEach((cardData) => {
        const cardParent = document.getElementById(`card-${cardData.id}`) as HTMLElement | null;
        if (cardParent) {
          this.#cards.push(new MovieCard(cardParent, cardData));
        }
      });

      this.#prevButton.addEventListener('click', this.prevSlide);
      this.#nextButton.addEventListener('click', this.nextSlide);

      this.updateCarousel();
    }
  }

  prevSlide = (): void => {
    if (this.#cards.length > 0) {
      this.#currentIndex = (this.#currentIndex - 1 + this.#cards.length) % this.#cards.length;
      this.updateCarousel();
    }
  };

  nextSlide = (): void => {
    if (this.#cards.length > 0) {
      this.#currentIndex = (this.#currentIndex + 1) % this.#cards.length;
      this.updateCarousel();
    }
  };

  updateCarousel(): void {
    if (this.#carouselContainer) {
      const cardWidth = this.#cards.length > 0 ? this.#cards[0].self()?.offsetWidth || 0 : 0;
      this.#carouselContainer.style.transform = `translateX(-${this.#currentIndex * cardWidth}px)`;
    }
  }

  destroy(): void {
    this.#prevButton?.removeEventListener('click', this.prevSlide);
    this.#nextButton?.removeEventListener('click', this.nextSlide);
    this.#parent.innerHTML = '';
    this.#cards.forEach((card) => card.destroy());
    this.#cards = [];
    this.#carouselContainer = null;
    this.#prevButton = null;
    this.#nextButton = null;
    this.#currentIndex = 0;
  }
}

export default CardCarousel;
