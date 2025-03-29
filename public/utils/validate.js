import { ERRORS } from 'public/consts.js';
import { ERROR_HANDLERS } from 'public/consts.js';

/**
 * Валидация логина
 * @param {string} login - почта
 * @returns {function(context)} - обработчик ошибки
 */
export function isValidLogin(login) {
  if (login.length < 2 || login.length > 18) {
    return ERROR_HANDLERS[ERRORS.ErrLengthLogin];
  }

  const allowedLocalChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  for (const char of login) {
    if (!allowedLocalChars.includes(char)) {
      return ERROR_HANDLERS[ERRORS.ErrAlphabetLogin];
    }
  }
}

/**
 * Валидация пароля
 * @param {string} password - пароль
 * @returns {function(context)} - обработчик ошибки
 */
export function isVaidPassword(password) {
  if (password.length < 6) {
    return ERROR_HANDLERS[ERRORS.ErrPasswordTooShort];
  }
  if (password.length > 18) {
    return ERROR_HANDLERS[ERRORS.ErrPasswordTooLong];
  }
  if (password.trim() === '') {
    return ERROR_HANDLERS[ERRORS.ErrEmptyPassword];
  }
}
