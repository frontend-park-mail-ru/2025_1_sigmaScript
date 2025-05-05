export const BACKEND_PORT = 8080;
export const FRONTEND_PORT = 3000;
// export const HOST = '217.16.20.177';
export const HOST = 'localhost';
// export const HOST = '127.0.0.1';
export const AUTH_URL = `http://${HOST}:${BACKEND_PORT}/auth/`;
export const PERSON_URL = `http://${HOST}:${BACKEND_PORT}/name/`;
export const MOVIE_URL = `http://${HOST}:${BACKEND_PORT}/movie`;
export const STATS_URL = `http://${HOST}:${BACKEND_PORT}/csat/statistic`;
export const GENRES_URL = `http://${HOST}:${BACKEND_PORT}/genres`;
export const MOVIE_REVIEWS_PATH = `reviews`;
export const ERRORS = {
  ErrParseJSONShort: 'parse_json_error',
  ErrAlreadyExistsShort: 'already_exists',
  ErrPasswordsMismatchShort: 'passwords_mismatch',
  ErrBcryptShort: 'bcrypt_error',
  ErrSendJSON: 'Error sending JSON',
  ErrEncodeJSONShort: 'encode_json_error',
  ErrIncorrectLoginOrPasswordShort: 'not_found',
  ErrGenerateSessionShort: 'generate_session_error',
  ErrUnauthorizedShort: 'unauthorized',
  ErrSessionNotExistsShort: 'not_exists',
  ErrInvalidPasswordShort: 'invalid_password',
  ErrPasswordTooShort: 'Password too short',
  ErrPasswordTooLong: 'Password too long',
  ErrEmptyPassword: 'Empty password',
  ErrEasyPassword: 'Easy password',
  ErrDefault: 'internal_error',
  ErrInvalidLogin: 'invalid_login',
  ErrLengthLogin: 'length_login',
  ErrAlphabetLogin: 'alphabet_login',
  ErrNotFound: 'not_found'
};
export const BASE_URL = `http://${HOST}:${BACKEND_PORT}/`;
export const FRONT_URL = `http://${HOST}:${FRONTEND_PORT}/`;

export const ERROR_HANDLERS = {
  [ERRORS.ErrAlreadyExistsShort]: (context) => context.showError(context.loginInput, 'Вы уже зарегистрированы'),
  [ERRORS.ErrPasswordsMismatchShort]: (context) =>
    context.showError(context.passwordInput, 'Пароли не совпадают', context.repeatInput),
  [ERRORS.ErrIncorrectLoginOrPasswordShort]: (context) =>
    context.showError(context.passwordInput, 'Неправильный логин или пароль', context.loginInput),
  [ERRORS.ErrInvalidLogin]: (context) => context.showError(context.loginInput, 'Неправильный логин'),
  [ERRORS.ErrLengthLogin]: (context) => context.showError(context.loginInput, 'Длина логина 2-18 символов'),
  [ERRORS.ErrAlphabetLogin]: (context) => context.showError(context.loginInput, 'Символы a-z, A-Z, 0-9, _, -'),
  [ERRORS.ErrPasswordTooShort]: (context, input) => context.showError(input, 'Длина пароля менее 6 символов'),
  [ERRORS.ErrPasswordTooLong]: (context, input) => context.showError(input, 'Длина пароля более 18 символов'),
  [ERRORS.ErrEmptyPassword]: (context) =>
    context.showError(context.passwordInput, 'Пустой пароль', context.repeatInput),
  [ERRORS.ErrDefault]: (context) => context.showError(context.lastInput, 'Что-то пошло не так. Попробуйте ещё')
};

// TODO: наполнить  информацией
export const FOOTER_CONFIG = {
  columns: [
    {
      title: 'FILMLOOK'
    }
  ],
  copyright: '© 2025 sigmaScript'
};

export const AVATAR_PLACEHOLDER = 'static/img/avatar_placeholder.webp';

export function Authable(url) {
  return AUTHABLE.includes(url);
}

export const AUTHABLE = ['/profile'];

export const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
