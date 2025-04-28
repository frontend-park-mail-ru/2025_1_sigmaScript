import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, StatsActionTypes } from 'flux/ActionTypes'; // !!!
import { CSATStatisticDataJSON } from 'types/stats_page.types'; // !!!
import { serializeTimeZToHumanTime } from '../modules/time_serialiser';
import { initialStore } from './InitialStore';
import StatsPage from 'pages/stats_page/stats_page';
import request, { ErrorWithDetails } from 'utils/fetch';
import { statsDataLoaded, statsDataError, loadStatsData } from 'flux/Actions';

import { STATS_URL } from 'public/consts';
import { deserialize } from 'utils/Serialize';

type StatsPageState = {
  data: CSATStatisticDataJSON | null;
  isLoading: boolean;
  error: string | null;
};

type Listener = (state: StatsPageState) => void;

class StatsPageStore {
  private state: StatsPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      data: null,
      isLoading: false,
      error: null
    };
    this.listeners = [];
    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_STATS_PAGE:
        this.state.data = null;
        this.state.isLoading = true;
        this.state.error = null;
        this.renderStatsPageContainer();
        loadStatsData();
        break;

      case StatsActionTypes.LOAD_STATS_DATA:
        try {
          const url = STATS_URL;
          const response = await request({ url: url, method: 'GET', credentials: true });
          const statsData = deserialize(response.body) as CSATStatisticDataJSON;

          if (statsData.reviews) {
            for (let i = 0; i < statsData.reviews.length; i++) {
              statsData.reviews[i].createdAt = serializeTimeZToHumanTime(statsData.reviews[i].createdAt);
            }
          }

          statsDataLoaded(statsData as CSATStatisticDataJSON);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof ErrorWithDetails
              ? error.errorDetails.error || error.message
              : 'Не удалось загрузить данные о статистике';
          statsDataError(errorMessage);
        }
        break;

      case StatsActionTypes.STATS_DATA_LOADED:
        this.state.data = action.payload as CSATStatisticDataJSON;
        this.state.isLoading = false;
        this.state.error = null;
        this.emitChange();
        break;

      case StatsActionTypes.STATS_DATA_ERROR:
        this.state.data = null;
        this.state.isLoading = false;
        this.state.error = action.payload as string;
        this.emitChange();
        break;
    }
  }

  private renderStatsPageContainer() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    initialStore.destroyStored();
    const statsPage = new StatsPage(rootElement);
    initialStore.store(statsPage);
    statsPage.render();
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

  getState(): StatsPageState {
    return this.state;
  }
}

export default new StatsPageStore();
