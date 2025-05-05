import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, GenreActionTypes } from 'flux/ActionTypes';
import { initialStore } from './InitialStore';
import request, { ErrorWithDetails } from 'utils/fetch';
import { genreDataError, genreDataLoaded, loadGenreData } from 'flux/Actions';
import { deserialize } from 'utils/Serialize';
import { MovieCollection } from 'types/main_page.types';
import GenrePage from 'pages/genrePage/genrePage';
import { GENRES_URL } from 'public/consts';

export type GenrePageData = {
  name: string;
  movies: MovieCollection;
};

export type GenrePageState = {
  genreId: number | string | null;
  genreData: GenrePageData | null;
  isLoading: boolean;
  error: string | null;
};

type Listener = (state: GenrePageState) => void;

class GenrePageStore {
  private state: GenrePageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      genreId: null,
      genreData: null,
      isLoading: false,
      error: null
    };
    this.listeners = [];
    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_GENRE_PAGE:
        this.state.genreId = action.payload as number | string;
        this.state.genreData = null;
        this.state.isLoading = true;
        this.state.error = null;
        this.renderGenrePageContainer();
        loadGenreData(this.state.genreId);
        break;

      case GenreActionTypes.LOAD_GENRE_DATA: {
        try {
          const url = `${GENRES_URL}/${this.state.genreId}`;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const genresData = deserialize(response.body) as GenrePageData;
          genreDataLoaded(genresData as GenrePageData);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные жанров';
          genreDataError(errorMessage);
        }
        break;
      }

      case GenreActionTypes.GENRE_DATA_LOADED:
        this.state.genreData = action.payload as GenrePageData;
        this.state.isLoading = false;
        this.state.error = null;
        this.emitChange();
        break;

      case GenreActionTypes.GENRE_DATA_ERROR:
        this.state.genreData = null;
        this.state.isLoading = false;
        this.state.error = action.payload as string;
        this.emitChange();
        break;
    }
  }

  private renderGenrePageContainer() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    initialStore.destroyStored();
    const genrePage = new GenrePage(rootElement);
    initialStore.store(genrePage);
    genrePage.render();
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

  getState(): GenrePageState {
    return this.state;
  }
}

export default new GenrePageStore();
