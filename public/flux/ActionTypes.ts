export const LoginActionTypes = {
  LOGIN_SUBMIT: 'LOGIN_SUBMIT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REGISTER_SUBMIT: 'REGISTER_SUBMIT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR'
};

export const RenderActionTypes = {
  RENDER_MAIN_PAGE: 'MAIN_PAGE',
  RENDER_NAVBAR: 'RENDER_NAVBAR',
  RENDER_FOOTER: 'RENDER_FOOTER',

  RENDER_AUTH_REG_PAGE: 'RENDER_AUTH_REG_PAGE',
  RENDER_MOVIE_PAGE: 'RENDER_MOVIE_PAGE',
  RENDER_PERSON_PAGE: 'RENDER_PERSON_PAGE',
  RENDER_PROFILE_PAGE: 'RENDER_PROFILE_PAGE'
};

export const GetDataActionTypes = {
  PERSON_NOT_FOUND_ERROR: 'PERSON_NOT_FOUND_ERROR',
  SESSION_NOT_FOUND_ERROR: 'SESSION_NOT_FOUND_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const MovieActionTypes = {
  LOAD_MOVIE_DATA: 'LOAD_MOVIE_DATA',
  MOVIE_DATA_LOADED: 'MOVIE_DATA_LOADED',
  MOVIE_DATA_ERROR: 'MOVIE_DATA_ERROR'

export const UserPageTypes = {
  UPDATE_USER_PAGE: 'UPDATE_USER_PAGE',
  GET_USER: 'GET_USER',
  UPDATE_USER: 'UPDATE_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  NO_SESSION: 'NO_SESSION'
};
