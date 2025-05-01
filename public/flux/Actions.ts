import { dispatcher } from 'flux/Dispatcher';
import {
  LoginActionTypes,
  RenderActionTypes,
  UserPageTypes,
  MovieActionTypes,
  StatsActionTypes,
  PopupActionTypes
} from 'flux/ActionTypes';
import { UpdateUserData, UserData } from 'types/UserPage.types';
import { MovieData, NewReviewDataJSON, Review, Reviews } from 'types/movie_page.types';
import { CSATStatisticDataJSON } from 'types/stats_page.types';
import { PopupType } from 'types/Popup.types';
import { MovieDataJSON } from 'types/main_page.types';
import { PersonCardInfo } from 'types/Person.types';

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

export function loadMovieReviewsData(movieId: string | number) {
  dispatcher.dispatch({
    type: MovieActionTypes.LOAD_MOVIE_REVIEWS_DATA,
    payload: movieId
  });
}

export function movieDataLoaded(movieData: MovieData) {
  dispatcher.dispatch({
    type: MovieActionTypes.MOVIE_DATA_LOADED,
    payload: movieData
  });
}

export function movieReviewsDataLoaded(movieReviewsData: Reviews) {
  dispatcher.dispatch({
    type: MovieActionTypes.MOVIE_REVIEWS_DATA_LOADED,
    payload: movieReviewsData
  });
}

export function movieDataError(error: string) {
  dispatcher.dispatch({
    type: MovieActionTypes.MOVIE_DATA_ERROR,
    payload: error
  });
}

export function postMovieReview(reviewData: NewReviewDataJSON) {
  dispatcher.dispatch({
    type: MovieActionTypes.POST_MOVIE_REVIEW,
    payload: reviewData
  });
}

export function addMovieToFavorite(movieData: MovieDataJSON) {
  dispatcher.dispatch({
    type: UserPageTypes.ADD_MOVIE_TO_FAVORITE,
    payload: movieData
  });
}

export function addActorToFavorite(actor: PersonCardInfo) {
  dispatcher.dispatch({
    type: UserPageTypes.ADD_ACTOR_TO_FAVORITE,
    payload: actor
  });
}

export function addReview(review: Review) {
  dispatcher.dispatch({
    type: UserPageTypes.ADD_REVIEW,
    payload: review
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
      payload: id
    });
  },
  renderStatsPage() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_STATS_PAGE
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
  },
  renderCsatPage() {
    dispatcher.dispatch({
      type: RenderActionTypes.RENDER_CSAT_PAGE
    });
  }
};

export const PopupActions = {
  showPopup(payload: PopupType) {
    dispatcher.dispatch({
      type: PopupActionTypes.SHOW_POPUP,
      payload
    });
  },
  hidePopup() {
    dispatcher.dispatch({
      type: PopupActionTypes.HIDE_POPUP
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

export function updateUserAvatar(selectedFile: Blob) {
  dispatcher.dispatch({
    type: UserPageTypes.UPDATE_USER_AVATAR,
    payload: selectedFile
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
export function renderCsat() {
  dispatcher.dispatch({
    type: RenderActionTypes.RENDER_CSAT
  });
}

export function statsDataLoaded(data: CSATStatisticDataJSON) {
  dispatcher.dispatch({
    type: StatsActionTypes.STATS_DATA_LOADED,
    payload: data
  });
}

export function statsDataError(error: string) {
  dispatcher.dispatch({
    type: StatsActionTypes.STATS_DATA_ERROR,
    payload: error
  });
}

export function loadStatsData() {
  dispatcher.dispatch({
    type: StatsActionTypes.LOAD_STATS_DATA
  });
}
