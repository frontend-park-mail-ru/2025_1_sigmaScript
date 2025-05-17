import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, MovieActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { MovieData, NewReviewDataJSON, Reviews } from 'types/movie_page.types';
import { formatDateTime, serializeTimeZToHumanTime, serializeTimeZToHumanYear } from '../modules/time_serialiser';
import { initialStore } from './InitialStore';
import MoviePage from 'pages/movie_page/movie_page';
import request, { ErrorWithDetails } from 'utils/fetch';
import {
  movieDataLoaded,
  movieDataError,
  loadMovieData,
  movieReviewsDataLoaded,
  loadMovieReviewsData,
  renderCsat,
  PopupActions,
  addReview,
  getUser
} from 'flux/Actions';

import { MOVIE_URL, MOVIE_REVIEWS_PATH } from 'public/consts';
import { deserialize, serialize } from 'utils/Serialize';
import UserPageStore from './UserPageStore';

type MoviePageState = {
  movieId: number | string | null;
  movieData: MovieData | null;
  isLoading: boolean;
  error: string | null;
};

type Listener = (state: MoviePageState) => void;

class MoviePageStore {
  private state: MoviePageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      movieId: null,
      movieData: null,
      isLoading: false,
      error: null
    };
    this.listeners = [];
    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_MOVIE_PAGE:
        this.state.movieId = action.payload as number | string;
        this.state.movieData = null;
        this.state.isLoading = true;
        this.state.error = null;
        this.renderMoviePageContainer();
        loadMovieData(this.state.movieId);
        break;

      case MovieActionTypes.LOAD_MOVIE_DATA:
        if (!this.state.movieId) {
          movieDataError('Movie ID is missing');
          return;
        }
        try {
          const url = `${MOVIE_URL}/${this.state.movieId}`;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const movieData = deserialize(response.body) as MovieData;

          if (movieData.reviews) {
            for (let i = 0; i < movieData.reviews.length; i++) {
              movieData.reviews[i].createdAt = serializeTimeZToHumanTime(movieData.reviews[i].createdAt);
            }
          }

          movieDataLoaded(movieData as MovieData);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные фильма';
          movieDataError(errorMessage);
        }
        break;

      case MovieActionTypes.LOAD_MOVIE_REVIEWS_DATA:
        if (!this.state.movieId) {
          movieDataError('Movie ID is missing');
          return;
        }
        try {
          const url = `${MOVIE_URL}/${this.state.movieId}/${MOVIE_REVIEWS_PATH}`;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const reviewData = deserialize(response.body) as Reviews;
          movieReviewsDataLoaded(reviewData);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные отзывов фильма';
          movieDataError(errorMessage);
        }
        break;

      case MovieActionTypes.MOVIE_DATA_LOADED:
        this.state.movieData = action.payload as MovieData;
        this.state.isLoading = false;
        this.state.error = null;
        if (this.state.movieData.releaseYear)
          this.state.movieData.releaseYear = serializeTimeZToHumanYear(this.state.movieData.releaseYear);
        this.emitChange();
        break;

      case MovieActionTypes.MOVIE_REVIEWS_DATA_LOADED:
        if (this.state.movieData && this.state.movieId) {
          this.state.movieData.reviews = action.payload as Reviews;
          for (let i = 0; i < this.state.movieData.reviews.length; i++) {
            this.state.movieData.reviews[i].createdAt = serializeTimeZToHumanTime(
              this.state.movieData.reviews[i].createdAt
            );
          }
        } else {
          movieDataError('Movie ID is missing');
          return;
        }

        this.state.isLoading = false;
        this.state.error = null;
        this.emitChange();
        break;

      case MovieActionTypes.MOVIE_DATA_ERROR:
        this.state.movieData = null;
        this.state.isLoading = false;
        this.state.error = action.payload as string;
        this.emitChange();
        break;

      case MovieActionTypes.POST_MOVIE_REVIEW:
        if (!this.state.movieId) {
          movieDataError('Movie ID is missing');
          return;
        }
        try {
          const date = new Date();

          const payload = action.payload as NewReviewDataJSON;

          const url = `${MOVIE_URL}/${this.state.movieId}/${MOVIE_REVIEWS_PATH}`;
          const body = serialize({
            ...payload
          }) as Record<string, unknown>;
          await request({ url: url, method: 'POST', body, credentials: true });

          addReview({
            // TODO: перекинуть айдишник нормальный
            id: -1,
            user: {
              login: UserPageStore.getState().userData?.username as string
            },
            reviewText: payload.reviewText,
            score: payload.score,
            createdAt: formatDateTime(date),
            movieID: this.state.movieId as number
          });

          loadMovieReviewsData(this.state.movieId);
          // TODO: временное решение, потом переделать
          getUser();
        } catch {
          const errorMessage = 'Не удалось отправить данные нового отзыва фильма';
          movieDataError(errorMessage);
          // TODO error handle
          // alert(errorMessage);
          PopupActions.showPopup({
            message: errorMessage,
            duration: 2500,
            isError: true
          });
        }

        renderCsat();
        break;
      case UserPageTypes.UPDATE_USER_PAGE: {
        this.state.needUpdateFavorite = true;
        this.emitChange();
        this.state.needUpdateFavorite = false;
        break;
      }
      default:
        break;
    }
  }

  private renderMoviePageContainer() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    initialStore.destroyStored();
    const moviePage = new MoviePage(rootElement);
    initialStore.store(moviePage);
    moviePage.render();
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState(): MoviePageState {
    return this.state;
  }
}

export default new MoviePageStore();
