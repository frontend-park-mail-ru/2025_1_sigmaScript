import { dispatcher } from 'flux/Dispatcher';
import { LoginActionTypes, RenderActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { UpdateUserData, UserData } from 'types/UserPage.types';

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

export const RenderActions = {
  renderMainPage() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_MAIN_PAGE
    });
  },
  renderNavbar() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_NAVBAR
    });
  },
  renderFooter() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_FOOTER
    });
  },
  renderAuthPage() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_AUTH_REG_PAGE
    });
  },
  renderMoviePage(id: number | string) {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_MOVIE_PAGE,
      payload: { id }
    });
  },
  renderPersonPage(id: number | string) {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_PERSON_PAGE,
      payload: id
    });
  },
  renderProfilePage(userData: UserData) {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_PROFILE_PAGE,
      payload: userData
    });
  }
};

export function updateUserPage(userData: UserData) {
  dispatcher.dispatch({
    type: UserPageTypes.UPDATE_USER_PAGE,
    payload: userData
  });
}

export function getUser() {
  dispatcher.dispatch({
    type: UserPageTypes.GET_USER
  });
}

export function updateUser(userData: UpdateUserData) {
  dispatcher.dispatch({
    type: UserPageTypes.UPDATE_USER,
    payload: userData
  });
}

export function logoutUser() {
  dispatcher.dispatch({
    type: UserPageTypes.LOGOUT_USER
  });
}

export function noSession() {
  dispatcher.dispatch({
    type: UserPageTypes.NO_SESSION
  });
}
