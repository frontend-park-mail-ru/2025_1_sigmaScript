import Navbar from 'components/navbar/navbar.js';
import { createID } from 'utils/createID';
import { Footer } from 'components/Footer/Footer';
import template from './movie.hbs';
import MovieCard from 'components/Card/Card';
import Button from 'components/universal_button/button';
import Scroll from 'components/Scroll/Scroll';
import Stars from 'components/Stars/Stars';
import Textarea from 'components/Textarea/Textarea';
import {
  Person,
  Genre,
  MovieData,
  DisplayField,
  fieldTranslations,
  keysToShow,
  fightClub
} from 'types/movie_page.types';

class MoviePage {
  #parent: HTMLElement;
  #headerId: string;
  #id: string;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = createID();
    this.#headerId = createID();
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    return this.#parent ? document.getElementById(this.#id) : null;
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    this.self()?.remove();
  }

  #prepareMovieInfoForDisplay(movie: MovieData): DisplayField[] {
    const displayFields: DisplayField[] = [];

    for (const key of keysToShow) {
      const value = movie[key];
      if (value === null || value === undefined) {
        continue;
      }
      const title = fieldTranslations[key as keyof typeof fieldTranslations] as string;
      let formattedValue = '';
      if (key === 'genres') {
        formattedValue = (value as Genre[]).map((genre) => genre.name).join(', ');
      } else if (key === 'staff') {
        formattedValue = (value as Person[])
          .slice(0, 4)
          .map((person) => person.fullName)
          .join(', ');
      } else if (key === 'budget' || key.startsWith('boxOffice')) {
        formattedValue = `$${value.toLocaleString('us-US')}`;
      } else if (key === 'duration') {
        formattedValue = `${value} час.`;
      } else {
        formattedValue = String(value);
      }
      displayFields.push({ title, value: formattedValue });
    }
    return displayFields;
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    this.destroy();

    const mainElem = document.createElement('main');
    mainElem.id = this.#id;
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = this.#headerId;
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader, () => {
      const rootElement = document.getElementById('root');
      rootElement!.innerHTML = '';
      const main = new MoviePage(rootElement!);
      main.render();
    });
    nav.render();

    const info = this.#prepareMovieInfoForDisplay(fightClub);
    mainElem.insertAdjacentHTML('beforeend', template({ id: this.#id, info: info, fightClub: fightClub })); // !!!

    this.#renderMovie();
    this.#renderStaff();
    this.#renderReviews();

    new Footer(mainElem).render();
  }

  #renderMovie(): void {
    const posterElem = document.querySelector<HTMLElement>('.js-poster');
    const movieButtons = document.querySelector<HTMLElement>('.js-movie-buttons');
    const ratingElement = document.querySelector<HTMLElement>('.js-movie__rating');
    const reviewElement = document.querySelector<HTMLElement>('.js-movie__review');
    if (!posterElem || !movieButtons || !ratingElement) return;

    new MovieCard(posterElem, {
      id: '123456',
      previewUrl: 'static/img/0.webp',
      width: '250',
      height: '375'
    }).render();

    new Button(movieButtons, {
      id: 'button--' + createID(),
      type: 'button',
      text: 'Трейлер',
      addClasses: ['movie__button'],
      srcIcon: 'static/svg/play.svg'
    }).render();

    new Button(movieButtons, {
      id: 'button--' + createID(),
      type: 'button',
      text: 'Любимое',
      addClasses: ['movie__button'],
      srcIcon: 'static/svg/favourite.svg'
    }).render();

    new Button(ratingElement, {
      id: 'button--' + createID(),
      type: 'button',
      text: 'Оценить фильм',
      addClasses: ['movie__button']
    }).render();

    new Button(reviewElement, {
      id: 'button--' + createID(),
      type: 'button',
      text: 'Оставить отзыв',
      addClasses: ['movie__button']
    }).render();
  }

  #renderStaff(): void {
    const staffListElement = document.querySelector<HTMLElement>('.js-staff-list');
    if (!staffListElement) return;

    const scroll = new Scroll(staffListElement);
    scroll.render();
    for (const actor of fightClub.staff || []) {
      const staffCard = new MovieCard(scroll.getContentContainer()!, {
        id: createID(),
        title: actor.fullName,
        previewUrl: actor.photo || 'static/img/10.webp',
        width: '130',
        height: '180'
      });
      staffCard.render();
    }
  }

  #renderReviews(): void {
    const reviewsElement = document.querySelector<HTMLElement>('.js-reviews');
    const reviewFormElement = reviewsElement?.querySelector<HTMLElement>('.js-review-form');
    if (!reviewsElement || !reviewFormElement) return;

    new Stars(reviewFormElement, {}).render();

    new Textarea(reviewFormElement, {
      id: 'input' + createID(),
      name: 'review',
      placeholder: 'Введите текст отзыва...',
      addClasses: ['review-form__textarea']
    }).render();

    new Button(reviewFormElement, {
      id: 'button--' + createID(),
      type: 'submit',
      text: 'Отправить',
      addClasses: ['movie__button', 'review-form__button']
    }).render();
  }
}

export default MoviePage;
