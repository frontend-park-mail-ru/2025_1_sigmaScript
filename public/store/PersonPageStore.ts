import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';

import { PersonState, PersonListener, PersonPayload } from 'types/Person.types';

import request, { ErrorWithDetails } from 'utils/fetch';
import { GetDataActionTypes, RenderActionTypes } from 'flux/ActionTypes';

import { initialStore } from './InitialStore';
import { PersonPage } from 'pages/person_page/person_page';
import { router } from '../modules/router';
import { PERSON_URL } from 'public/consts';
import { serializeTime } from '../modules/time_serialiser';
import { cmToMeters } from '../modules/smToMetersSerialiser';
import { ErrorPayload } from 'types/Auth.types';

class PersonPageStore {
  private listeners: Array<PersonListener>;
  private state: PersonState;

  constructor() {
    this.state = {
      error: null,
      person: {
        personID: null,
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
        favorite: null,
        dateOfDeath: null
      }
    };

    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private handleActions(action: Action): void {
    switch (action.type) {
      case RenderActionTypes.RENDER_PERSON_PAGE:
        this.renderPersonPage(action.payload as string);
        break;
      case GetDataActionTypes.PERSON_NOT_FOUND_ERROR:
        this.state.error = (action.payload as ErrorPayload).error;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  private async renderPersonPage(id: number | string) {
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        return;
      }

      const url = PERSON_URL + `${id}`;
      const responseData = await request({ url, method: 'GET', credentials: true });
      const jsonData = responseData.body;
      const personJSON = jsonData as PersonPayload;

      let personBirthDate = null;
      if (personJSON.birthday) {
        personBirthDate = serializeTime(personJSON.birthday as string);
      }

      let personState: PersonState = {
        error: null,
        person: {
          personID: personJSON.id,
          nameRu: personJSON.full_name,
          nameEn: personJSON.en_full_name,
          photoUrl: personJSON.photo,
          biography: personJSON.about,
          gender: personJSON.sex,
          height: cmToMeters(personJSON.growth),
          dateOfBirth: personBirthDate,
          dateOfDeath: personJSON.death,
          career: personJSON.career,
          genres: personJSON.genres,
          totalFilms: personJSON.total_films,

          favorite: personJSON.favorite
        }
      };

      initialStore.destroyStored();
      const personPage = new PersonPage(rootElement, router.getCurrentPath(), personState.person);
      initialStore.store(personPage);
      personPage.render();
    } catch (error: unknown) {
      dispatcher.dispatch({
        type: GetDataActionTypes.PERSON_NOT_FOUND_ERROR,
        payload: { error: this.getErrorMessage(error) }
      });
    }
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

  setState(person: PersonState): void {
    this.state = person;
  }

  getState(): PersonState {
    return this.state;
  }
}

export default new PersonPageStore();
