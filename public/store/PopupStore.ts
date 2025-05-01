import { dispatcher } from 'flux/Dispatcher';
import { PopupActionTypes } from 'flux/ActionTypes';
import { PopupActions } from 'flux/Actions';
import type { Action } from 'types/Dispatcher.types';
import type { PopupState, PopupType } from 'types/Popup.types';

class PopupStore {
  #state: PopupState = { current: null };
  #listeners: Array<(s: PopupState) => void> = [];
  #timeoutId: number | null = null;

  constructor() {
    dispatcher.register(this.#handleActions.bind(this));
  }

  #handleActions(action: Action): void {
    switch (action.type) {
      case PopupActionTypes.SHOW_POPUP: {
        // очистим старый таймер, если есть
        if (this.#timeoutId != null) {
          clearTimeout(this.#timeoutId);
        }

        // запомним новые данные
        const payload = action.payload as PopupType;
        this.#state.current = payload;
        this.#emitChange();

        // автоскрытие
        this.#timeoutId = window.setTimeout(() => {
          PopupActions.hidePopup();
        }, payload.duration);
        break;
      }

      case PopupActionTypes.HIDE_POPUP: {
        // сбросим таймер
        if (this.#timeoutId != null) {
          clearTimeout(this.#timeoutId);
          this.#timeoutId = null;
        }
        // очистим состояние и оповестим вью
        this.#state.current = null;
        this.#emitChange();
        break;
      }

      default:
        break;
    }
  }

  subscribe(fn: (s: PopupState) => void): void {
    this.#listeners.push(fn);
  }

  unsubscribe(fn: (s: PopupState) => void): void {
    this.#listeners = this.#listeners.filter((f) => f !== fn);
  }

  #emitChange(): void {
    for (const fn of this.#listeners) {
      fn(this.#state);
    }
  }

  getState(): PopupState {
    return this.#state;
  }
}

export default new PopupStore();
