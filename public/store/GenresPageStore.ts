import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, GenresActionTypes } from 'flux/ActionTypes';
import { initialStore } from './InitialStore';
// TODO (waiting DB)
// import request, { ErrorWithDetails } from 'utils/fetch';
// genresDataError
import { genresDataLoaded, loadGenresData } from 'flux/Actions';
import { deserialize } from 'utils/Serialize';
import GenresPage from 'pages/genresPage/genresPage';

export type Movie = {
  id: number;
  title: string;
  previewUrl: string;
  rating: number;
};

export type Genre = {
  id: number;
  name: string;
  movies: Movie[];
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
        const genresData = deserialize(tempGenresData) as GenresData;
        genresDataLoaded(genresData as GenresData);
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

const tempGenresData: GenresData = [
  {
    id: 1,
    name: 'Боевик',
    movies: [
      { id: 1, title: 'Бойцовский клуб', previewUrl: '/img/0.webp', rating: 9.8 },
      { id: 2, title: 'Матрица', previewUrl: '/img/7.webp', rating: 9.5 },
      { id: 3, title: 'Форрест Гамп', previewUrl: '/img/2.webp', rating: 9.7 },
      { id: 4, title: 'Крестный отец', previewUrl: '/img/3.webp', rating: 9.9 },
      { id: 5, title: 'Интерстеллар', previewUrl: '/img/4.webp', rating: 9.6 },
      { id: 6, title: 'Криминальное чтиво', previewUrl: '/img/5.webp', rating: 9.4 },
      { id: 7, title: 'Побег из Шоушенка', previewUrl: '/img/6.webp', rating: 9.9 },
      { id: 8, title: 'Тёмный рыцарь', previewUrl: '/img/1.webp', rating: 9.5 },
      { id: 9, title: 'Зелёная миля', previewUrl: '/img/8.webp', rating: 9.6 },
      { id: 10, title: 'Одержимость', previewUrl: '/img/9.webp', rating: 9.3 }
    ]
  },
  {
    id: 2,
    name: 'Драма',
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
      { id: 20, title: 'Ford против Ferrari', previewUrl: '/img/10.webp', rating: 8.9 }
    ]
  },
  {
    id: 3,
    name: 'Фантастика',
    movies: [
      { id: 1, title: 'Бойцовский клуб', previewUrl: '/img/0.webp', rating: 9.8 },
      { id: 2, title: 'Матрица', previewUrl: '/img/7.webp', rating: 9.5 },
      { id: 3, title: 'Форрест Гамп', previewUrl: '/img/2.webp', rating: 9.7 },
      { id: 4, title: 'Крестный отец', previewUrl: '/img/3.webp', rating: 9.9 },
      { id: 5, title: 'Интерстеллар', previewUrl: '/img/4.webp', rating: 9.6 },
      { id: 6, title: 'Криминальное чтиво', previewUrl: '/img/5.webp', rating: 9.4 },
      { id: 7, title: 'Побег из Шоушенка', previewUrl: '/img/6.webp', rating: 9.9 },
      { id: 8, title: 'Тёмный рыцарь', previewUrl: '/img/1.webp', rating: 9.5 },
      { id: 9, title: 'Зелёная миля', previewUrl: '/img/8.webp', rating: 9.6 },
      { id: 10, title: 'Одержимость', previewUrl: '/img/9.webp', rating: 9.3 }
    ]
  }
];

export default new GenresPageStore();
