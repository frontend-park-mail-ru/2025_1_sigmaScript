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
import MainPage from 'pages/main_page/main_page';
import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from 'public/consts.js';
import { Urls } from 'public/modules/router';

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
        // !!!
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

    const nav = new Navbar(mainElemHeader, () => {
      const rootElement = document.getElementById('root')!;
      rootElement.innerHTML = '';
      const main = new MainPage(rootElement, { id: `${createID()}` });
      main.render();
    });
    nav.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList.add('movie-page', 'flex-dir-col', 'flex-start', 'content');
    mainElemContent.id = this.#id;
    mainElem.appendChild(mainElemContent);

    const footer = new Footer(mainElem, FOOTER_CONFIG);
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
      const infoForDisplay = this.#prepareMovieInfo(movie);

      container.innerHTML = template({
        movie: movie,
        info: infoForDisplay
      });

      this.#renderMovieCardAndButtons(movie);
      this.#renderStaff(movie.staff || []);
      this.#renderReviewForm();
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }

  #renderMovieCardAndButtons(movie: MovieData): void {
    const container = this.self();
    if (!container) return;

    const posterElem = container.querySelector<HTMLElement>('.js-poster');
    const movieButtons = container.querySelector<HTMLElement>('.js-movie-buttons');
    const ratingElement = container.querySelector<HTMLElement>('.js-movie__rating');
    const reviewButtonElement = container.querySelector<HTMLElement>('.js-movie__review');

    if (posterElem) posterElem.innerHTML = '';
    if (movieButtons) movieButtons.innerHTML = '';

    ratingElement?.querySelector('.movie__button')?.remove();
    reviewButtonElement?.querySelector('.movie__button')?.remove();

    if (posterElem) {
      new MovieCard(posterElem, {
        id: `movieCard--${movie.id}`,
        previewUrl: movie.poster || '/static/img/default_preview.png',
        width: '250',
        height: '375'
      }).render();
    }

    if (movieButtons) {
      new Button(movieButtons, {
        id: 'button--trailer-' + createID(),
        type: 'button',
        text: 'Трейлер',
        addClasses: ['movie__button'],
        srcIcon: '/static/svg/play.svg',
        actions: {
          click: () => {
            console.log(`Play trailer for movie ${movie.id}`);
          }
        }
      }).render();
      new Button(movieButtons, {
        id: 'button--favourite-' + createID(),
        type: 'button',
        text: 'Любимое',
        addClasses: ['movie__button'],
        srcIcon: '/static/svg/favourite.svg',
        actions: {
          click: () => {
            console.log(`Toggle favourite for movie ${movie.id}`);
          }
        }
      }).render();
    }

    if (ratingElement) {
      new Button(ratingElement, {
        id: 'button--rate-' + createID(),
        type: 'button',
        text: 'Оценить фильм',
        addClasses: ['movie__button'],
        actions: {
          click: () => {
            this.self()?.querySelector('.js-review-form')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }).render();
    }

    if (reviewButtonElement) {
      new Button(reviewButtonElement, {
        id: 'button--leave-review-' + createID(),
        type: 'button',
        text: 'Оставить отзыв',
        addClasses: ['movie__button'],
        actions: {
          click: () => {
            this.self()?.querySelector('.js-review-form')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }).render();
    }
  }

  #renderStaff(staff: Person[]): void {
    const staffListElement = this.self()?.querySelector<HTMLElement>('.js-staff-list');
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
        id: `personCard--${person.id}`,
        title: person.fullName,
        url: `${Urls.person}/${person.id}`,
        previewUrl: person.photo || '/static/img/default_person.png',
        width: '130',
        height: '180'
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
      addClasses: ['review-form__textarea']
    });
    textarea.render();

    new Button(formElement, {
      id: 'button--submit-review-' + createID(),
      type: 'submit',
      text: 'Отправить',
      addClasses: ['movie__button', 'review-form__button']
    }).render();

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      const rating = this.#stars?.currentRating;
      const text = textarea.getValue();

      console.log(`Rating: ${rating}, Text: ${text}`);
    });

    // TODO: добавить саму отправку отзыва (возможно, через handlebars)
  }
}

export default MoviePage;
