import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, MovieActionTypes } from 'flux/ActionTypes';
import { MovieData } from 'types/movie_page.types';
import { initialStore } from './InitialStore';
import MoviePage from 'pages/movie_page/movie_page';
import request, { ErrorWithDetails } from 'utils/fetch';
import { movieDataLoaded, movieDataError, loadMovieData } from 'flux/Actions';
import { MOVIE_URL } from 'public/consts';
import { deserialize } from 'utils/Serialize';
// import { fightClub } from 'types/movie_page.types';
// import { BASE_URL } from 'public/consts';

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
          console.log(this.state.movieId);
          const url = `${MOVIE_URL}/${this.state.movieId}`;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const movieData = deserialize(response.body) as MovieData;
          movieDataLoaded(movieData as MovieData);
        } catch (error: unknown) {
          console.error('Failed to load movie data:', error);
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные фильма';
          movieDataError(errorMessage);
        }
        break;

      case MovieActionTypes.MOVIE_DATA_LOADED:
        this.state.movieData = action.payload as MovieData;
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
