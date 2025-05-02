import { dispatcher } from 'flux/Dispatcher';
import { PopupActionTypes } from 'flux/ActionTypes';
import { PopupActions } from 'flux/Actions';
import type { Action } from 'types/Dispatcher.types';
import type { Listener, PopupState, PopupType } from 'types/Popup.types';

class PopupStore {
  private state: PopupState = { current: null };
  private listeners: Array<(s: PopupState) => void> = [];
  private timeoutId: number | null = null;

  constructor() {
    dispatcher.register(this.#handleActions.bind(this));
  }

  #handleActions(action: Action): void {
    switch (action.type) {
      case PopupActionTypes.SHOW_POPUP: {
        if (this.timeoutId != null) {
          clearTimeout(this.timeoutId);
        }

        const payload = action.payload as PopupType;
        this.state.current = payload;
        this.emitChange();

        this.timeoutId = window.setTimeout(() => {
          PopupActions.hidePopup();
        }, payload.duration);

        break;
      }
      case PopupActionTypes.HIDE_POPUP: {
        if (this.timeoutId != null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        this.state.current = null;
        this.emitChange();
        break;
      }
      default:
        break;
    }
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

  getState(): PopupState {
    return this.state;
  }
}

export default new PopupStore();
