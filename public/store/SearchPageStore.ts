import { RenderActionTypes, SearchActionTypes } from 'flux/ActionTypes';
import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { initialStore } from './InitialStore';
import { Listener, SearchJSONState, SearchPageState } from 'types/SearchPage.types';
import { SearchPage } from 'pages/SearchPage/SearchPage';
import UserPageStore from './UserPageStore';
import { PopupActions, searchCompleted } from 'flux/Actions';
import { MovieCollection, MovieDataJSON } from 'types/main_page.types';
import { PersonCardInfo, PersonCollection, PersonJSONCollection } from 'types/Person.types';
import { BASE_URL } from 'public/consts';
import request from 'utils/fetch';
import { deserialize, serialize } from 'utils/Serialize';

class SearchPageStore {
  private state: SearchPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      movieCollection: new Map<number, MovieDataJSON>(),
      actorCollection: new Map<number, PersonCardInfo>()
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
        // let state: SearchPageState = {
        //   actorCollection: UserPageStore.getState().actorCollection,
        //   movieCollection: UserPageStore.getState().movieCollection
        // };

        try {
          const url = BASE_URL + 'search';
          const body = {
            search: action.payload as string
          };
          const response = await request({ url, method: 'POST', body, credentials: true });
          const res = deserialize(response.body) as SearchJSONState;
          res.movieCollection = serialize(res?.movieCollection) as MovieCollection;
          res.actors = serialize(res?.actors) as PersonJSONCollection;
          const actors = res?.actors?.map((actor) => {
            return {
              personID: actor.id,
              nameRu: actor.full_name,
              photoUrl: actor.photo
            };
          }) as PersonCollection;

          this.state.movieCollection = new Map(res.movieCollection?.map((movie) => [movie.id, movie]));
          this.state.actorCollection = new Map(actors?.map((actor) => [actor.personID as number, actor]));

          searchCompleted(this.state);
        } catch {
          // TODO: сделать нормальную обработку ошибок
          // PopupActions.showPopup({
          //   message: 'Не удалось выполнить поиск!',
          //   duration: 2500,
          //   isError: true
          // });
        }
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
