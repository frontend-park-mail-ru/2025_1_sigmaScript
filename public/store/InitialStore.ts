import { Destroyable } from 'public/consts';

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

  async start() {}
}

export const initialStore = new InitialStore();
