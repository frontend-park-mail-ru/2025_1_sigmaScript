import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';

import { Listener, AuthState } from 'types/Auth.types';
import { ErrorWithDetails } from 'utils/fetch';
import { RenderActionTypes } from 'flux/ActionTypes';

import MainPage from 'pages/main_page/main_page';
import { createID } from 'utils/createID';
import { initialStore } from './InitialStore';
import { MainPageConfig } from 'types/main_page.types';

class MainPageStore {
  private state: AuthState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      user: null,
      error: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private handleActions(action: Action): void {
    switch (action.type) {
      case RenderActionTypes.RENDER_MAIN_PAGE:
        this.renderMain();
        break;
      default:
        break;
    }
  }

  private renderMain() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
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

  getState(): AuthState {
    return this.state;
  }
}

export default new MainPageStore();
