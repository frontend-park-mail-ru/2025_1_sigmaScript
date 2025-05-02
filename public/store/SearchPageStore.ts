import { RenderActionTypes, SearchActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { initialStore } from './InitialStore';
import { Listener, SearchPageState } from 'types/SearchPage.types';
import { SearchPage } from 'pages/SearchPage/SearchPage';
import UserPageStore from './UserPageStore';
import { searchCompleted } from 'flux/Actions';

class SearchPageStore {
  private state: SearchPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      movieCollection: [],
      actorCollection: []
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_SEARCH_PAGE:
        this.renderSearchPage();
        break;
      case SearchActionTypes.SEARCH: {
        // временное решение пока нет бд
        let state: SearchPageState = {
          actorCollection: UserPageStore.getState().actorCollection,
          movieCollection: UserPageStore.getState().movieCollection
        };
        searchCompleted(state);
        break;
      }
      case SearchActionTypes.SEARCH_COMPLETED:
        this.state = action.payload as SearchPageState;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  private renderSearchPage() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }

    initialStore.destroyStored();
    const searchPage = new SearchPage(rootElement);
    initialStore.store(searchPage);

    searchPage.render();
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

  getState(): SearchPageState {
    return this.state;
  }
}

export default new SearchPageStore();
