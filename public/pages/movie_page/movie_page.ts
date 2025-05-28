import { createID } from 'utils/createID';
import template from './movie_page.hbs';
import userReviewTemplate from './user_review.hbs';
import MovieCard from 'components/Card/Card';
import Button from 'components/universal_button/button';
import Scroll from 'components/Scroll/Scroll';
import Stars from 'components/Stars/Stars';
import Textarea from 'components/Textarea/Textarea';
import { Person, MovieData, DisplayField, fieldTranslations, keysToShow, Review } from 'types/movie_page.types';
import MoviePageStore from 'store/MoviePageStore';
import Loading from 'components/Loading/loading';
import Navbar from 'components/navbar/navbar';
import DOMPurify from 'dompurify';
import { router } from 'modules/router';

import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from '../../consts.js';
import { Urls } from '../../modules/router';
import { FooterData } from 'types/Footer.types.js';
import { addMovieToFavorite, postMovieReview, removeMovieFromFavorite, PopupActions } from 'flux/Actions.ts';
import UserPageStore from 'store/UserPageStore.ts';
import { serializeTimeZToHumanDate } from 'modules/time_serialiser';
import { getRatingColor } from 'utils/ratingColor';
import { scrollToElement } from 'utils/scrollToElement';
import { MovieCollection } from 'types/main_page.types.js';

type MoviePageStateFromStore = {
  movieId: number | string | null;
  movieData: MovieData | null;
  similar: MovieCollection | null;
  isLoading: boolean;
  error: string | null;
};

class MoviePage {
  #parent: HTMLElement;
  #id: string;
  #state: MoviePageStateFromStore = {
    movieId: null,
    movieData: null,
    similar: null,
    isLoading: true,
    error: null
  };
  #favoriteButtons: Button[] | null;
  #stars: Stars | null = null;
  private bindedHandleStoreChange: (state: MoviePageStateFromStore) => void;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'moviePage--' + createID();
    this.#state = MoviePageStore.getState();
    this.#favoriteButtons = null;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    MoviePageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: MoviePageStateFromStore): void {
    this.#state = newState;
    this.update();
    if (UserPageStore.getState().userData?.username) {
      this.#favoriteButtons?.forEach((element: Button) => {
        element.render();
      });
    }
    if (newState.needUpdateFavorite) {
      const isFavorite = UserPageStore.isFavoriteMovie(this.#state?.movieData?.id as number);
      if (isFavorite) {
        this.#favoriteButtons?.forEach((element: Button) => {
          element.setColor('favorite');
        });
      } else {
        this.#favoriteButtons?.forEach((element: Button) => {
          element.setColor('primary');
        });
      }
      return;
    }
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#id);
  }

  destroy(): void {
    MoviePageStore.unsubscribe(this.bindedHandleStoreChange);
    document.documentElement.classList.remove('movie-page-html');
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
      if (key === 'staff') {
        formattedValue = (value as Person[])
          .slice(0, 4)
          .map((person) => person.fullName)
          .join(', ');
      } else if (key === 'budget' || key.startsWith('boxOffice')) {
        formattedValue = `$${value.toLocaleString('us-US')}`;
      } else if (key === 'duration') {
        formattedValue = `${value}`;
      } else if (key === 'premierGlobal') {
        formattedValue = serializeTimeZToHumanDate(value as string);
      } else if (key === 'premierRussia') {
        formattedValue = serializeTimeZToHumanDate(value as string);
      } else {
        formattedValue = String(value);
      }
      displayFields.push({ title, value: formattedValue });
    }
    return displayFields;
  }

  render(): void {
    document.documentElement.classList.add('movie-page-html');
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
      const infoForDisplay = this.#prepareMovieInfo(movie);
      const currentUser = UserPageStore.getState().userData;

      const filteredMovie = {
        ...movie,
        reviews: movie.reviews?.filter((review) => review.reviewText && review.reviewText.trim() !== '') || []
      };

      container.innerHTML = template({
        movie: filteredMovie,
        info: infoForDisplay,
        showAuth: !currentUser?.username
      });

      this.#renderActors(movie.staff || []);
      this.#renderSimilar(movie.similarMovies || []);
      this.#renderReviewForm();
      this.#renderButtons();
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

  #renderSimilar(similar: MovieCollection): void {
    const similarListElement = this.self()?.querySelector<HTMLElement>('.js-similar-list');
    if (!similarListElement) return;
    similarListElement.innerHTML = '';

    if (similar.length === 0) {
      similarListElement.innerHTML = 'Этот фильм пока уникален, вернитесь сюда позже.</p>';
      return;
    }

    const scroll = new Scroll(similarListElement);
    scroll.render();
    const contentContainer = scroll.getContentContainer();
    if (!contentContainer) return;

    for (const movie of similar) {
      new MovieCard(contentContainer, {
        id: createID(),
        title: movie.title,
        url: `${Urls.movie}/${movie.id}`,
        previewUrl: movie.previewUrl || '/static/img/default_preview.webp'
      }).render();
    }
  }

  #renderReviewForm(): void {
    const currentUser = UserPageStore.getState().userData;
    const currentMovie = this.#state.movieData;
    if (!currentUser?.username) {
      const authLink = this.self()?.querySelector('.auth-link');
      if (authLink) {
        authLink.addEventListener('click', (event) => {
          event.preventDefault();
          router.go(Urls.auth);
        });
      }
      return;
    }

    const formElement = this.self()?.querySelector<HTMLElement>('.js-review-form');
    if (!formElement) return;

    const existingReview = currentMovie?.reviews?.find((review: Review) => review.user.login === currentUser.username);

    if (existingReview) {
      this.#renderExistingReview(formElement, existingReview);
    } else {
      this.#renderNewReviewForm(formElement);
    }
  }

  #renderNewReviewForm(formElement: HTMLElement): void {
    formElement.innerHTML = '';

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

      const rating = this.#stars?.currentRating;
      const text = textarea.getValue()?.trim() || '';

      if (!rating || rating === 0) {
        PopupActions.showPopup({
          message: 'Пожалуйста, поставьте оценку',
          duration: 2500,
          isError: true
        });
        return;
      }

      postMovieReview({
        reviewText: DOMPurify.sanitize(text),
        score: rating
      });
    });
  }

  #renderExistingReview(formElement: HTMLElement, review: Review): void {
    formElement.innerHTML = '';

    const sanitizedReviewText =
      review.reviewText && review.reviewText.trim() !== ''
        ? DOMPurify.sanitize(review.reviewText)
        : '<i class="movie-page__review-placeholder">Вы оценили этот фильм, но не оставили текстовый отзыв</i>';

    const reviewHTML = userReviewTemplate({
      score: review.score,
      createdAt: review.createdAt,
      reviewText: sanitizedReviewText
    });

    formElement.innerHTML = reviewHTML;

    const editButton = new Button(formElement, {
      id: 'button--edit-review-' + createID(),
      type: 'button',
      text: 'Редактировать',
      addClasses: ['movie-page-button', 'movie-page__review-form-button']
    });
    editButton.render();

    editButton.self()?.addEventListener('click', () => {
      this.#renderEditReviewForm(formElement, review);
    });
  }

  #renderEditReviewForm(formElement: HTMLElement, existingReview: Review): void {
    formElement.innerHTML = '';

    this.#stars = new Stars(formElement, { initialRating: existingReview.score });
    this.#stars.render();

    const textarea = new Textarea(formElement, {
      id: 'textarea--edit-review-' + createID(),
      name: 'review',
      text: existingReview.reviewText || '',
      placeholder: 'Введите текст отзыва...',
      addClasses: ['movie-page__review-form-textarea']
    });
    textarea.render();

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'movie-page__review-form-buttons flex-dir-row';
    formElement.appendChild(buttonContainer);

    new Button(buttonContainer, {
      id: 'button--save-review-' + createID(),
      type: 'submit',
      text: 'Сохранить',
      addClasses: ['movie-page-button', 'movie-page__review-form-button']
    }).render();

    new Button(buttonContainer, {
      id: 'button--cancel-review-' + createID(),
      type: 'button',
      text: 'Отмена',
      addClasses: ['movie-page-button', 'movie-page__review-form-button', 'movie-page-button--secondary']
    }).render();

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      const rating = this.#stars?.currentRating;
      const text = textarea.getValue()?.trim() || '';

      if (!rating || rating === 0) {
        PopupActions.showPopup({
          message: 'Пожалуйста, поставьте оценку',
          duration: 2500,
          isError: true
        });
        return;
      }

      postMovieReview({
        reviewText: DOMPurify.sanitize(text),
        score: rating
      });
    });

    buttonContainer.querySelector('#button--cancel-review-' + createID().slice(-8))?.addEventListener('click', () => {
      this.#renderExistingReview(formElement, existingReview);
    });
  }

  #renderButtons(): void {
    this.#favoriteButtons = [];
    const container = this.self();
    if (!container) return;
    const movieButtons = container.querySelector<HTMLElement>('.js-movie-buttons');
    const movieButtonsMobile = container.querySelector<HTMLElement>('.js-movie-buttons-mobile');
    const buttonContainers = [movieButtons, movieButtonsMobile];
    for (const buttonContainer of buttonContainers) {
      if (!buttonContainer) continue;
      buttonContainer.innerHTML = '';
      new Button(buttonContainer, {
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

      new Button(buttonContainer, {
        id: 'button--reviews-' + createID(),
        type: 'button',
        text: 'Отзывы',
        addClasses: ['movie-info-column__reviws-button', 'movie-page-button', 'movie-page-button--secondary'],
        actions: {
          click: () => {
            scrollToElement('.js-reviews');
          }
        }
      }).render();
      const currentUser = UserPageStore.getState().userData;
      const currentMovie = this.#state.movieData;
      let userRating = 0;
      let ratingText = '';
      let ratingIcon = '/static/svg/star--white.svg';

      if (currentUser?.username && currentMovie?.reviews) {
        const userReview = currentMovie.reviews.find((review: Review) => review.user.login === currentUser.username);
        if (userReview) {
          userRating = userReview.score;
          ratingText = userRating.toString();
        }
      }

      const ratingButton = new Button(buttonContainer, {
        id: 'button--rating-' + createID(),
        type: 'button',
        text: ratingText,
        addClasses: ['movie-info-column__rating-button', 'movie-page-button', 'movie-page-button--secondary'],
        srcIcon: ratingText ? undefined : ratingIcon,
        actions: {
          click: () => {
            scrollToElement('.js-reviews');
          }
        }
      });

      ratingButton.render();

      if (!ratingText) {
        const buttonElement = ratingButton.self();
        if (buttonElement) {
          buttonElement.classList.add('movie-info-column__rating-button--icon-only');
        }
      }

      if (userRating > 0) {
        const buttonElement = ratingButton.self();
        if (buttonElement) {
          const ratingColor = getRatingColor(userRating);
          const textElement = buttonElement.querySelector('.u_button__text');
          if (textElement) {
            (textElement as HTMLElement).style.color = ratingColor;
          }
        }
      }

      const button = new Button(buttonContainer, {
        id: 'button--favourite-' + createID(),
        type: 'button',
        addClasses: ['movie-info-column__favoutite-button', 'movie-page-button'],
        srcIcon: '/static/svg/favourite.svg',
        actions: {
          click: () => {
            const id = this.#state?.movieData?.id;
            if (UserPageStore.isFavoriteMovie(id!)) {
              removeMovieFromFavorite(id!);
              this.#favoriteButtons?.forEach((element: Button) => {
                element.setColor('none');
              });
            } else {
              addMovieToFavorite({
                id: id!,
                title: this.#state.movieData?.name as string,
                rating: this.#state.movieData?.rating || 0,
                preview_url: this.#state.movieData?.poster as string
              });
              this.#favoriteButtons?.forEach((element: Button) => {
                element.setColor('favorite');
              });
            }
          }
        }
      });
      this.#favoriteButtons?.push(button);
      if (UserPageStore.getState().userData?.username) {
        button?.render();

        const isFavorite = UserPageStore.isFavoriteMovie(this.#state?.movieData?.id as number);
        if (isFavorite) {
          this.#favoriteButtons?.forEach((element: Button) => {
            element.setColor('favorite');
          });
        } else {
          this.#favoriteButtons?.forEach((element: Button) => {
            element.setColor('primary');
          });
        }
      }
    }
  }
}

export default MoviePage;
