import { dispatcher } from 'flux/Dispatcher';
import { LoginActionTypes } from 'flux/ActionTypes';
import { RENDER_USER_PAGE } from 'flux/ActionTypes';
import { UserData } from 'types/UserPage.types';

export function loginSubmit(username: string, password: string) {
  dispatcher.dispatch({
    type: LoginActionTypes.LOGIN_SUBMIT,
    payload: { username, password }
  });
}

export function registerSubmit(username: string, password: string, repeatPassword: string) {
  dispatcher.dispatch({
    type: LoginActionTypes.REGISTER_SUBMIT,
    payload: { username, password, repeatPassword }
  });
}

export function renderUserPage(parent: HTMLElement, userData: UserData) {
  dispatcher.dispatch({
    type: RENDER_USER_PAGE,
    payload: { parent, userData }
  });
}
