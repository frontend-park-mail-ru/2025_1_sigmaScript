import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RENDER_USER_PAGE } from 'flux/ActionTypes';
import { UserPageState, Listener } from 'types/UserPage.types';

class UserPageStore {
  private state: UserPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      parent: null,
      userData: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private handleActions(action: Action): void {
    const payload = action.payload as UserPageState;
    switch (action.type) {
      case RENDER_USER_PAGE:
        this.state.parent = payload.parent;
        this.state.userData = payload.userData;
        this.emitChange();
        break;
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

  getState(): UserPageState {
    return this.state;
  }
}

export default new UserPageStore();
