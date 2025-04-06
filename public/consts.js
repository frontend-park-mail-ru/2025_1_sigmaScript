export const BACKEND_PORT = 8080;
export const HOST = 'localhost';
export const AUTH_URL = `http://${HOST}:${BACKEND_PORT}/auth/`;
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
  ErrAlphabetLogin: 'alphabet_login'
};
export const BASE_URL = `http://${HOST}:${BACKEND_PORT}/`;

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

// TODO: наполнить информацией
export const FOOTER_CONFIG = {
  columns: [
    {
      title: 'FILMLOOK'
    }
  ],
  copyright: '© 2025 sigmaScript'
};
