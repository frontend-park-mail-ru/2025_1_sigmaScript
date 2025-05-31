import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';

import { AuthState } from 'types/Auth.types';
import request, { ErrorWithDetails } from 'utils/fetch';
import { RenderActionTypes, MainActionTypes } from 'flux/ActionTypes';

import { mainDataLoaded, mainDataError, loadMainData, renderCsat } from 'flux/Actions';

import MainPage from 'pages/main_page/main_page';
import { createID } from 'utils/createID';
import { initialStore } from './InitialStore';
import { MainPageConfig, Collections } from 'types/main_page.types';
import { BASE_URL } from 'public/consts';
import { deserialize } from 'utils/Serialize';

type MainPageState = {
  auth: AuthState;
  mainData: Collections | null;
  isLoading: boolean;
  error: string | null;
};

type Listener = (state: MainPageState) => void;

class MainPageStore {
  private state: MainPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      auth: {
        user: null,
        error: null
      },
      mainData: null,
      isLoading: false,
      error: null
    };
    this.listeners = [];
    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_MAIN_PAGE:
        this.state.isLoading = true;
        this.state.error = null;
        this.renderMainPageContainer();
        if (this.state.mainData) {
          mainDataLoaded(this.state.mainData);
          break;
        }
        loadMainData();
        break;

      case MainActionTypes.LOAD_MAIN_DATA:
        try {
          const url = BASE_URL + 'collections/';
          const response = await request({ url: url, method: 'GET', credentials: true });
          const mainData = deserialize(response.body) as Collections;
          mainDataLoaded(mainData as Collections);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные подборок';
          mainDataError(errorMessage);
        }
        break;

      case MainActionTypes.MAIN_DATA_LOADED:
        this.state.mainData = action.payload as Collections;
        this.state.isLoading = false;
        this.state.error = null;
        this.emitChange();
        break;

      case MainActionTypes.MAIN_DATA_ERROR:
        this.state.mainData = null;
        this.state.isLoading = false;
        this.state.error = action.payload as string;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  private renderMainPageContainer() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    // setTimeout(
    //   () => {
    //     renderCsat();
    //   },
    //   1000 * 60 * 10
    // );
    initialStore.destroyStored();
    const main = new MainPage(rootElement, { id: createID() } as MainPageConfig);
    initialStore.store(main);
    main.render();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof ErrorWithDetails) {
      return error.errorDetails.error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error';
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

  getState(): MainPageState {
    return this.state;
  }
}

export default new MainPageStore();
