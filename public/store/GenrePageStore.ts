import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, GenreActionTypes } from 'flux/ActionTypes';
import { initialStore } from './InitialStore';
// TODO (waiting DB)
// import request, { ErrorWithDetails } from 'utils/fetch';
// genreDataError
import { genreDataLoaded, loadGenreData } from 'flux/Actions';
import { deserialize } from 'utils/Serialize';
import { MovieCollection } from 'types/main_page.types';
import GenrePage from 'pages/genrePage/genrePage';

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
        // TODO (waiting DB)
        // try {
        //   const url = GENRES_URL;
        //   const response = await request({ url: url, method: 'GET', credentials: true });
        //   const genresData = deserialize(response.body) as Collections;
        //   genresDataLoaded(genresData as Collections);
        // } catch (error: unknown) {
        //   const errorMessage =
        //     error instanceof ErrorWithDetails
        //       ? error.errorDetails.error || error.message
        //       : 'Не удалось загрузить данные жанров';
        //   genresDataError(errorMessage);
        // }
        const genreData = deserialize(tempGenreData) as GenrePageData;
        genreDataLoaded(genreData as GenrePageData);
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

const tempGenreData: GenrePageData = {
  name: 'Боевик',
  movies: [
    { id: 11, title: 'Оппенгеймер', previewUrl: '/img/11.webp', rating: 9.2 },
    { id: 12, title: 'Звёздные войны: Эпизод 4 – Новая надежда', previewUrl: '/img/12.webp', rating: 9 },
    { id: 13, title: 'Рокки', previewUrl: '/img/13.webp', rating: 8.8 },
    { id: 14, title: 'Джокер', previewUrl: '/img/14.webp', rating: 9.1 },
    { id: 15, title: 'Игра в имитацию', previewUrl: '/img/15.webp', rating: 8.9 },
    { id: 16, title: 'Начало', previewUrl: '/img/16.webp', rating: 9.4 },
    { id: 17, title: 'Назад в будущее', previewUrl: '/img/17.webp', rating: 9.3 },
    { id: 18, title: 'Гладиатор', previewUrl: '/img/18.webp', rating: 9 },
    { id: 19, title: 'Титаник', previewUrl: '/img/19.webp', rating: 8.7 },
    { id: 20, title: 'Ford против Ferrari', previewUrl: '/img/10.webp', rating: 8.9 },
    { id: 11, title: 'Оппенгеймер', previewUrl: '/img/11.webp', rating: 9.2 },
    { id: 12, title: 'Звёздные войны: Эпизод 4 – Новая надежда', previewUrl: '/img/12.webp', rating: 9 },
    { id: 13, title: 'Рокки', previewUrl: '/img/13.webp', rating: 8.8 },
    { id: 14, title: 'Джокер', previewUrl: '/img/14.webp', rating: 9.1 },
    { id: 15, title: 'Игра в имитацию', previewUrl: '/img/15.webp', rating: 8.9 },
    { id: 16, title: 'Начало', previewUrl: '/img/16.webp', rating: 9.4 },
    { id: 17, title: 'Назад в будущее', previewUrl: '/img/17.webp', rating: 9.3 },
    { id: 18, title: 'Гладиатор', previewUrl: '/img/18.webp', rating: 9 },
    { id: 19, title: 'Титаник', previewUrl: '/img/19.webp', rating: 8.7 },
    { id: 20, title: 'Ford против Ferrari', previewUrl: '/img/10.webp', rating: 8.9 },
    { id: 11, title: 'Оппенгеймер', previewUrl: '/img/11.webp', rating: 9.2 },
    { id: 12, title: 'Звёздные войны: Эпизод 4 – Новая надежда', previewUrl: '/img/12.webp', rating: 9 },
    { id: 13, title: 'Рокки', previewUrl: '/img/13.webp', rating: 8.8 },
    { id: 14, title: 'Джокер', previewUrl: '/img/14.webp', rating: 9.1 },
    { id: 15, title: 'Игра в имитацию', previewUrl: '/img/15.webp', rating: 8.9 },
    { id: 16, title: 'Начало', previewUrl: '/img/16.webp', rating: 9.4 },
    { id: 17, title: 'Назад в будущее', previewUrl: '/img/17.webp', rating: 9.3 },
    { id: 18, title: 'Гладиатор', previewUrl: '/img/18.webp', rating: 9 },
    { id: 19, title: 'Титаник', previewUrl: '/img/19.webp', rating: 8.7 },
    { id: 20, title: 'Ford против Ferrari', previewUrl: '/img/10.webp', rating: 8.9 }
  ]
};

export default new GenrePageStore();
