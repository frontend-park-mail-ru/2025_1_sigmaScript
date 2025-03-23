import { ERRORS } from 'public/consts.js';
import { ERROR_HANDLERS } from 'public/consts.js';

/**
 * Валидация почты
 * @param {string} email - почта
 * @returns {function(context)} - обработчик ошибки
 */
export function isValidEmail(email) {
  const atIndex = email.indexOf('@');
  if (atIndex < 1 || atIndex === email.length - 1) {
    return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (local.length === 0 || local.startsWith('.') || local.endsWith('.')) {
    return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
  }

  if (domain.length === 0 || domain.split('.').length < 2) {
    return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
  }

  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
  }

  const forbiddenChars = [' ', '(', ')', ',', ';', ':', '<', '>', '[', ']', '\\', '..'];
  for (const char of forbiddenChars) {
    if (email.includes(char)) {
      return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
    }
  }

  const allowedLocalChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.!#$%&'*+/=?^_`{|}~-";
  for (const char of local) {
    if (!allowedLocalChars.includes(char)) {
      return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
    }
  }

  const allowedDomainChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-';
  for (const char of domain) {
    if (!allowedDomainChars.includes(char)) {
      return ERROR_HANDLERS[ERRORS.ErrInvalidEmail];
    }
  }
}

/**
 * Валидация пароля
 * @param {string} password - почта
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
