import { CardConfig } from 'components/Card/Card';
import template from './Carousel.hbs';
import './Carousel.css';

export function Carousel(parent: HTMLElement, cards: CardConfig[]) {
  const buttonNext = document.createElement('button');
  buttonNext.classList.add('card-carousel__button', 'card-carousel__button--next');
  buttonNext.textContent = 'LEFT';
  const buttonPrev = document.createElement('button');
  buttonPrev.textContent = 'RIGHT';
  buttonPrev.classList.add('card-carousel__button', 'card-carousel__button--prev');

  parent.appendChild(buttonNext);
  parent.appendChild(buttonPrev);

  parent.innerHTML += template({ images: cards });

  return;
}

//   destroy(): void {
//     this.#prevButton?.removeEventListener('click', this.prevSlide);
//     this.#nextButton?.removeEventListener('click', this.nextSlide);
//     this.#parent.innerHTML = '';
//     this.#cards.forEach((card) => card.destroy());
//     this.#cards = [];
//     this.#carouselContainer = null;
//     this.#prevButton = null;
//     this.#nextButton = null;
//     this.#currentIndex = 0;
//   }
// }

// export default CardCarousel;
