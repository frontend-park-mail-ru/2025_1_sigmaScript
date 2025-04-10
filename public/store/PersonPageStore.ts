import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';

import { PersonState, PersonListener } from 'types/Person.types';

import { ErrorWithDetails } from 'utils/fetch';
import { RenderActionTypes } from 'flux/ActionTypes';

import { initialStore } from './InitialStore';
import { PersonPage } from 'pages/person_page/person_page';
import { router } from '../modules/router';

class PersonPageStore {
  private listeners: Array<PersonListener>;
  private state: PersonState;

  constructor() {
    this.state = {
      photoUrl: null,
      nameRu: null,
      nameEn: null,
      career: null,
      height: null,
      gender: null,
      dateOfBirth: null,
      genres: null,
      totalFilms: null,
      biography: null,
      favorite: null
    };

    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private handleActions(action: Action): void {
    switch (action.type) {
      case RenderActionTypes.RENDER_PERSON_PAGE:
        this.renderPersonPage();
        break;
      default:
        break;
    }
  }

  private renderPersonPage() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.log('!!!!!!!!!!');
      return;
    }

    initialStore.destroyStored();
    const personPage = new PersonPage(rootElement, router.getCurrentPath());
    initialStore.store(personPage);

    personPage.render();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof ErrorWithDetails) {
      return error.errorDetails.error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error';
  }

  subscribe(listener: PersonListener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: PersonListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState(): PersonState {
    return this.state;
  }
}

export default new PersonPageStore();
