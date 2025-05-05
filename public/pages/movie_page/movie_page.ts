import { createID } from 'utils/createID';
import template from './movie_page.hbs';
import MovieCard from 'components/Card/Card';
import Button from 'components/universal_button/button';
import Scroll from 'components/Scroll/Scroll';
import Stars from 'components/Stars/Stars';
import Textarea from 'components/Textarea/Textarea';
import { Person, Genre, MovieData, DisplayField, fieldTranslations, keysToShow } from 'types/movie_page.types';
import MoviePageStore from 'store/MoviePageStore';
import Loading from 'components/Loading/loading';
import Navbar from 'components/navbar/navbar';

import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from '../../consts.js';
import { router, Urls } from '../../modules/router';
import { FooterData } from 'types/Footer.types.js';
import { postMovieReview } from 'flux/Actions.ts';
import UserPageStore from 'store/UserPageStore.ts';

type MoviePageStateFromStore = {
  movieId: number | string | null;
  movieData: MovieData | null;
  isLoading: boolean;
  error: string | null;
};

class MoviePage {
  #parent: HTMLElement;
  #id: string;
  #state: MoviePageStateFromStore = {
    movieId: null,
    movieData: null,
    isLoading: true,
    error: null
  };
  #stars: Stars | null = null;
  private bindedHandleStoreChange: (state: MoviePageStateFromStore) => void;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'moviePage--' + createID();
    this.#state = MoviePageStore.getState();

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    MoviePageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: MoviePageStateFromStore): void {
    this.#state = newState;
    this.update();
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#id);
  }

  destroy(): void {
    MoviePageStore.unsubscribe(this.bindedHandleStoreChange);
    this.self()?.remove();
  }

  #prepareMovieInfo(movie: MovieData): DisplayField[] {
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
        formattedValue = `${value}`;
      } else {
        formattedValue = String(value);
      }
      displayFields.push({ title, value: formattedValue });
    }
    return displayFields;
  }

  render(): void {
    this.#parent.innerHTML = '';
    const mainElem = document.createElement('main');
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    nav.render();
    nav.self()?.classList.add('navbar--gradient-none');

    const mainElemContent = document.createElement('div');
    mainElemContent.classList.add('movie-page', 'flex-dir-col', 'flex-start', 'content');
    mainElemContent.id = this.#id;
    mainElem.appendChild(mainElemContent);

    const footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    footer.render();

    this.update();
  }

  update(): void {
    const container = this.self();
    if (!container) return;
    container.innerHTML = '';

    if (this.#state.isLoading) {
      new Loading(container).render();
      return;
    }

    if (this.#state.error) {
      container.innerHTML = `<div style="width: 100%;" class="flex-dir-row flex-center"><div class="error">Ошибка: ${this.#state.error}</div></div>`;
      return;
    }

    if (this.#state.movieData) {
      const movie = this.#state.movieData;
      console.log('Movie data:', movie);
      const infoForDisplay = this.#prepareMovieInfo(movie);

      container.innerHTML = template({ movie, info: infoForDisplay });
      this.#renderActors(movie.staff || []);
      this.#renderReviewForm();
      this.#renderButtons(this.#state.movieId!);
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }

  #renderActors(staff: Person[]): void {
    const staffListElement = this.self()?.querySelector<HTMLElement>('.js-actors-list');
    if (!staffListElement) return;
    staffListElement.innerHTML = '';

    if (staff.length === 0) {
      staffListElement.innerHTML = '<p>Информация о составе недоступна.</p>';
      return;
    }

    const scroll = new Scroll(staffListElement);
    scroll.render();
    const contentContainer = scroll.getContentContainer();
    if (!contentContainer) return;

    for (const person of staff) {
      new MovieCard(contentContainer, {
        id: createID(),
        title: person.fullName,
        url: `${Urls.person}/${person.id}`,
        previewUrl: person.photo || '/static/img/default_person.webp',
        width: '150',
        height: '225'
      }).render();
    }
  }

  #renderReviewForm(): void {
    let formElement = this.self()?.querySelector<HTMLElement>('.js-review-form');
    if (!formElement) return;

    this.#stars = new Stars(formElement, {});
    this.#stars.render();

    const textarea = new Textarea(formElement, {
      id: 'textarea--review-' + createID(),
      name: 'review',
      placeholder: 'Введите текст отзыва...',
      addClasses: ['movie-page__review-form-textarea']
    });
    textarea.render();

    new Button(formElement, {
      id: 'button--submit-review-' + createID(),
      type: 'submit',
      text: 'Отправить',
      addClasses: ['movie-page-button', 'movie-page__review-form-button']
    }).render();

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      const rating = this.#stars?.currentRating === 0 ? 5 : this.#stars?.currentRating;
      const text = textarea.getValue();

      if (!rating || !UserPageStore.getState().userData?.username || text === undefined) {
        router.go('/auth');
        return;
      }

      postMovieReview({
        reviewText: text,
        score: rating
      });
    });
  }

  #renderButtons(id: string | number): void {
    const container = this.self();
    if (!container) return;
    const movieButtons = container.querySelector<HTMLElement>('.js-movie-buttons');
    if (movieButtons) {
      movieButtons.innerHTML = '';

      new Button(movieButtons, {
        id: 'button--trailer-' + createID(),
        type: 'button',
        text: 'Смотреть трейлер',
        addClasses: ['movie-info-column__trailer-button', 'movie-page-button'],
        srcIcon: '/static/svg/play.svg',
        actions: {
          click: () => {
            // TODO
          }
        }
      }).render();

      new Button(movieButtons, {
        id: 'button--favourite-' + createID(),
        type: 'button',
        addClasses: ['movie-info-column__favoutite-button', 'movie-page-button'],
        srcIcon: '/static/svg/favourite.svg',
        actions: {
          click: () => {
            // TODO error handle
            console.log(`Toggle favourite for movie ${id}`);
          }
        }
      }).render();
    }

    new Button(movieButtons, {
      id: 'button--review-' + createID(),
      type: 'button',
      addClasses: ['movie-info-column__review-button', 'movie-page-button'],
      srcIcon: '/static/svg/review.svg',
      actions: {
        click: () => {
          // TODO error handle
          console.log(`Toggle favourite for movie ${id}`);
        }
      }
    }).render();
  }
}

export default MoviePage;
