export const BACKEND_PORT = 8080;
export const AUTH_URL = `http://localhost:${BACKEND_PORT}/auth/`;
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
  ErrInvalidEmail: 'invalid_email'
};
export const BASE_URL = `http://localhost:${BACKEND_PORT}/`;

export const ERROR_HANDLERS = {
  [ERRORS.ErrAlreadyExistsShort]: (context) => context.showError(context.emailInput, 'Вы уже зарегистрированы'),
  [ERRORS.ErrPasswordsMismatchShort]: (context) =>
    context.showError(context.passwordInput, 'Пароли не совпадают', context.repeatInput),
  [ERRORS.ErrIncorrectLoginOrPasswordShort]: (context) =>
    context.showError(context.passwordInput, 'Неправильная почта или пароль', context.emailInput),
  [ERRORS.ErrInvalidEmail]: (context) => context.showError(context.emailInput, 'Неправильная почта'),
  [ERRORS.ErrPasswordTooShort]: (context) =>
    context.showError(context.passwordInput, 'Длина пароля менее 6 символов', context.repeatInput),
  [ERRORS.ErrPasswordTooLong]: (context) =>
    context.showError(context.passwordInput, 'Длина пароля более 18 символов', context.repeatInput),
  [ERRORS.ErrEmptyPassword]: (context) =>
    context.showError(context.passwordInput, 'Пустой пароль', context.repeatInput),
  [ERRORS.ErrDefault]: (context) => context.showError(context.lastInput, 'Что-то пошло не так. Попробуйте ещё')
};
