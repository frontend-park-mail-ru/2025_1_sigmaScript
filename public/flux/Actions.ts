import { dispatcher } from 'flux/Dispatcher';
import { LoginActionTypes, RenderActionTypes } from 'flux/ActionTypes';
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
      type: RenderActionTypes.RENDER_NAVBAR
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
  renderActorPage(id: number | string) {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_PERSON_PAGE,
      payload: id
    });
  },
  renderProfilePage() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_PROFILE_PAGE
    });
  }
};
