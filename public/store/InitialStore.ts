import { Destroyable } from 'public/consts';
import { getUser } from 'flux/Actions';

// InitialStore is used to manually dsestroy current page and unsubscribe from stores
class InitialStore<T extends Destroyable> {
  private storedActivePage: T | null = null;

  constructor() {}

  store(item: T): void {
    this.storedActivePage = item;
  }

  destroyStored(): void {
    if (this.storedActivePage) {
      this.storedActivePage.destroy();
      this.storedActivePage = null; // clear stored item after destruction
    }
  }

  async start() {
    getUser();
  }
}

export const initialStore = new InitialStore();
