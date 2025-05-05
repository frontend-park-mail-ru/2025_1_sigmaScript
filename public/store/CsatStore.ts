import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { initialStore } from './InitialStore';
import request from 'utils/fetch';
import { BASE_URL, FRONT_URL } from 'public/consts';
import UniversalModal from 'components/modal/modal';
import CsatModal from 'components/Csat/Csat';

export type Listener = (state: unknown) => void;

class CsatStore {
  private state: UniversalModal | null;
  private listeners: Array<Listener>;
  private rendered: boolean;

  constructor() {
    this.state = null;
    this.listeners = [];
    this.rendered = false;

    dispatcher.register(this.handleActions.bind(this));
  }

  resetFlag() {
    this.rendered = false;
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_CSAT_PAGE:
        this.renderCsatPage();
        break;
      case RenderActionTypes.RENDER_CSAT: {
        if (this.rendered === true) {
          return;
        }
        this.rendered = true;

        const csatModal = new CsatModal(document.body, {
          frontUrl: FRONT_URL,
          onSubmit: () => {}
        });

        csatModal.render();
        break;
      }
      case UserPageTypes.LOGOUT_USER:
        this.resetFlag();
        break;
      default:
        break;
    }
  }

  private renderCsatPage() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }

    initialStore.destroyStored();

    const modal = new UniversalModal(document.body, {
      title: 'Насколько вы удовлетворены удобством FILMLOOK?',
      confirmText: 'Далее',
      onConfirm: async () => {
        this.sendRating();
      },
      onCancel: () => {
        window.parent.postMessage({ type: 'CSAT_CLOSE' }, window.location.origin);
      },
      stars: true,
      csat: true
    });

    this.state = modal;

    initialStore.store(modal);

    modal.render();
    modal.open();
  }

  async sendRating() {
    const rating = this.state?.getRating();

    try {
      const url = BASE_URL + 'csat';
      const body = {
        score: rating
      };
      await request({ url, method: 'POST', body, credentials: true });
    } catch {
      // TODO error handle
      // console.log(error);
    }

    window.parent.postMessage({ type: 'CSAT_CLOSE', data: { rating } }, window.location.origin);
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
}

export default new CsatStore();
