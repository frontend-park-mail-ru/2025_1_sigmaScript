import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, GenresActionTypes } from 'flux/ActionTypes';
import { initialStore } from './InitialStore';
import request, { ErrorWithDetails } from 'utils/fetch';
import { genresDataError, genresDataLoaded, loadGenresData } from 'flux/Actions';
import { deserialize } from 'utils/Serialize';
import GenresPage from 'pages/genresPage/genresPage';
import { GENRES_URL } from 'public/consts';

export type Movie = {
  id: number;
  title: string;
  previewUrl: string;
  rating: number;
};

export type Genre = {
  id: number;
  name: string;
  movies?: Movie[];
};

export type GenresData = Genre[];

export type GenresPageState = {
  genresData: GenresData | null;
  isLoading: boolean;
  error: string | null;
};

type Listener = (state: GenresPageState) => void;

class GenresPageStore {
  private state: GenresPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      genresData: null,
      isLoading: false,
      error: null
    };
    this.listeners = [];
    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_GENRES_PAGE:
        this.state.genresData = null;
        this.state.isLoading = true;
        this.state.error = null;
        this.renderGenresPageContainer();
        loadGenresData();
        break;

      case GenresActionTypes.LOAD_GENRES_DATA: {
        try {
          const url = GENRES_URL;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const genresData = deserialize(response.body) as GenresData;
          genresDataLoaded(genresData as GenresData);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные жанров';
          genresDataError(errorMessage);
        }
        break;
      }

      case GenresActionTypes.GENRES_DATA_LOADED:
        this.state.genresData = action.payload as GenresData;
        this.state.isLoading = false;
        this.state.error = null;
        this.emitChange();
        break;

      case GenresActionTypes.GENRES_DATA_ERROR:
        this.state.genresData = null;
        this.state.isLoading = false;
        this.state.error = action.payload as string;
        this.emitChange();
        break;
    }
  }

  private renderGenresPageContainer() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    initialStore.destroyStored();
    const genresPage = new GenresPage(rootElement);
    initialStore.store(genresPage);
    genresPage.render();
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

  getState(): GenresPageState {
    return this.state;
  }
}

export default new GenresPageStore();
