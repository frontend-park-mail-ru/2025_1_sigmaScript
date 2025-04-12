import { dispatcher } from 'flux/Dispatcher';
import { LoginActionTypes, RenderActionTypes, MovieActionTypes } from 'flux/ActionTypes';
import { MovieData } from 'types/movie_page.types';

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

export function loadMovieData(movieId: string | number) {
  dispatcher.dispatch({
    type: MovieActionTypes.LOAD_MOVIE_DATA,
    payload: movieId
  });
}

export function movieDataLoaded(movieData: MovieData) {
  dispatcher.dispatch({
    type: MovieActionTypes.MOVIE_DATA_LOADED,
    payload: movieData
  });
}

export function movieDataError(error: string) {
  dispatcher.dispatch({
    type: MovieActionTypes.MOVIE_DATA_ERROR,
    payload: error
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
      payload: id
    });
  },
  renderPersonPage(id: number | string) {
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
