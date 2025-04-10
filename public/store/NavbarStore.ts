import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { UserPageTypes } from 'flux/ActionTypes';
import { NavbarState } from 'types/Navbar.types';
import { Listener } from 'types/Navbar.types';

class NavbarStore {
  private state: NavbarState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      parent: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case UserPageTypes.UPDATE_USER_PAGE:
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

  getState(): NavbarState {
    return this.state;
  }
}

export default new NavbarStore();
