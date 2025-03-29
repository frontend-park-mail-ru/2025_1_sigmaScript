import { createID } from 'utils/createID';
import Button from '../universal_button/button.js';
import Input from '../universal_input/input.js';
import { Switch } from '../Switch/Switch.js';
import { ERRORS, ERROR_HANDLERS } from 'public/consts';
import { isValidLogin, isVaidPassword } from 'utils/validate.js';
import { debounce } from 'utils/debounce.js';
import template from './Login.hbs';
import { loginSubmit, registerSubmit } from 'flux/Actions';
import AuthStore from 'store/LoginStore';
import type { AuthState } from 'types/Auth.types';

type ErrorHandler = (context: Login, input?: Input) => void;
const TypedERROR_HANDLERS = ERROR_HANDLERS as Record<string, ErrorHandler>;
const TypedERRORS = ERRORS as Record<string, string>;
const typedIsVaidPassword = isVaidPassword as (password: string) => ErrorHandler | undefined | null;

export class Login {
  #parent: HTMLElement;
  #id: string;
  #mode: number;
  private bindedHandleStoreChange: (state: AuthState) => void;
  prevPage: () => void;
  switch!: Switch;
  loginInput!: Input;
  passwordInput!: Input;
  repeatInput!: Input;
  submitButton!: Button;
  signInButton!: HTMLElement;
  signUpButton!: HTMLElement;
  backButton!: HTMLElement;
  lastInput: Input | null = null;

  /**
   * Создаёт новую форму входа/регистрации.
   * @param {HTMLElement} parent В какой элемент вставлять
   * @param {Function} prevPage Функция перехода на предыдущую страницу.
   * @param {boolean} mode Поле для сохранения состояния - вход или регистрация.
   */
  constructor(parent: HTMLElement, prevPage: () => void, mode: number) {
    this.#parent = parent;
    this.#id = 'login--' + createID();
    this.#mode = mode;
    this.prevPage = prevPage;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    AuthStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Задаем родителя.
   */
  setParent(newParent: HTMLElement): void {
    this.#parent = newParent;
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    return this.#parent ? document.getElementById(this.#id) : null;
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    this.destroy();
    if (!this.#parent) return;

    this.#parent.innerHTML += template({ id: this.#id });

    this.switch = new Switch(this.self()!, 'Вход', 'Регистрация');
    this.loginInput = new Input(this.self()!, {
      id: 'input' + createID(),
      name: 'login',
      type: 'text',
      placeholder: 'Логин'
    });
    this.passwordInput = new Input(this.self()!, {
      id: 'input' + createID(),
      name: 'password',
      type: 'password',
      placeholder: 'Пароль'
    });
    this.repeatInput = new Input(this.self()!, {
      id: 'input' + createID(),
      name: 'rep_password',
      type: 'password',
      placeholder: 'Повторите пароль'
    });
    this.submitButton = new Button(this.self()!, {
      id: 'button--' + createID(),
      type: 'submit',
      text: 'Регистрация',
      addClasses: ['login__u_button']
    });

    this.switch.render();
    this.loginInput.render();
    this.passwordInput.render();
    this.repeatInput.render();
    this.submitButton.render();

    this.signInButton = this.switch.self().querySelector('.switch__button--left')!;
    this.signUpButton = this.switch.self().querySelector('.switch__button--right')!;
    this.backButton = this.self()!.querySelector('.login__back')!;

    this.submitButton.disable();
    this.addEvents();

    if (this.#mode) {
      this.signUpMode();
    } else {
      this.signInMode();
    }
  }

  /**
   * Функция перехода в режим входа.
   */
  signInMode(): void {
    this.signInButton.classList.add('active');
    this.signUpButton.classList.remove('active');
    this.repeatInput.self()!.style.visibility = 'hidden';
    this.submitButton.setText('Войти');
    this.#mode = 1;
    this.resetForm();
    this.clearInputs();
  }

  /**
   * Функция перехода в режим регистрации.
   */
  signUpMode(): void {
    this.signInButton.classList.remove('active');
    this.signUpButton.classList.add('active');
    this.repeatInput.self()!.style.visibility = 'visible';
    this.submitButton.setText('Зарегистрироваться');
    this.#mode = 0;
    this.resetForm();
    this.clearInputs();
  }

  /**
   * Показывает ошибку в переданные поля ввода с указанным сообщением
   * @param {Input} firstInput - обязательное поле ввода.
   * @param {string} message - отображаемое сообщение об ошибке
   * @param {Input} [secondInput] - опциональное поле ввода
   */
  showError(firstInput: Input, message: string, secondInput: Input) {
    firstInput.getErrorContainer().innerHTML = message;
    firstInput.getInput().classList.add('error');
    secondInput?.getInput().classList.add('error');
  }

  /**
   * Очищает переданное поле ввода от ошибок
   * @param {Input} input - очищаемое поле ввода
   */
  removeError(input: Input): void {
    input.getErrorContainer().innerHTML = '';
    input.getInput().classList.remove('error');
  }

  /**
   * Сбрасывает форму
   */
  resetForm(): void {
    this.removeError(this.loginInput);
    this.removeError(this.passwordInput);
    this.removeError(this.repeatInput);
    this.submitButton.disable();
  }

  /**
   * Очищает поля ввода
   */
  clearInputs(): void {
    this.loginInput.clearInput();
    this.passwordInput.clearInput();
    this.repeatInput.clearInput();
  }

  /**
   * Валидация логина
   * @returns {bool}
   */
  validateLogin(): boolean {
    const handler = isValidLogin(this.loginInput.getValue().trim());
    if (handler) {
      handler(this);
      return false;
    }
    this.removeError(this.loginInput);
    return true;
  }

  /**
   * Валидация паролей
   * @returns {bool}
   */
  validatePassword(): boolean {
    let handler: ErrorHandler | undefined | null = null;
    const passwordValue = this.passwordInput.getValue() ?? '';
    const repeatValue = this.repeatInput?.getValue() ?? '';

    if (passwordValue.length > 0) {
      handler = typedIsVaidPassword(passwordValue);
      if (handler) {
        handler(this, this.passwordInput);
        return false;
      } else {
        if (this.passwordInput) this.removeError(this.passwordInput);
      }
    }

    const isSignUpMode = this.#mode === 0;

    if (repeatValue.length > 0) {
      handler = typedIsVaidPassword(repeatValue);
      if (isSignUpMode && handler) {
        handler(this, this.repeatInput);
        return false;
      } else {
        if (this.repeatInput && (!isSignUpMode || !handler)) {
          this.removeError(this.repeatInput);
        }
      }
    }

    if (isSignUpMode && passwordValue.length > 0 && repeatValue.length > 0 && passwordValue !== repeatValue) {
      const mismatchHandler = TypedERROR_HANDLERS[TypedERRORS.ErrPasswordsMismatchShort];
      if (mismatchHandler) {
        mismatchHandler(this);
      }
      return false;
    }

    return passwordValue.length > 0 && (this.#mode === 1 || (isSignUpMode && repeatValue.length > 0));
  }

  /**
   * Валидация полей ввода
   */
  validate(): void {
    this.resetForm();
    if (this.validateLogin() && this.validatePassword()) {
      this.submitButton.enable();
    } else {
      this.submitButton.disable();
    }
  }

  /**
   * Возвращает на предыдущую страницу
   */
  goBack() {
    AuthStore.unsubscribe(this.bindedHandleStoreChange);
    this.prevPage();
  }

  /**
   * Обработка изменений состояния в AuthStore.
   * @param {AuthState} state - текущее состояние авторизации из Store
   */
  handleStoreChange(state: AuthState) {
    if (state.error) {
      const err = state.error;
      this.lastInput = this.#mode === 1 ? this.passwordInput : this.repeatInput;

      for (const [key, handler] of Object.entries(ERROR_HANDLERS)) {
        if (err.includes(key)) {
          handler(this);
          return;
        }
      }
      ERROR_HANDLERS[ERRORS.ErrDefault](this);
      return;
    }
    if (state.user) {
      this.goBack();
    }
  }

  /**
   * Отправка формы
   * @param {Event} e - событие формы
   */
  submitForm(e: Event): void {
    e.preventDefault();
    this.resetForm();

    const login = this.loginInput.getValue().trim();
    const password = this.passwordInput.getValue();
    const repeatPassword = this.repeatInput.getValue();

    if (this.#mode === 1) {
      loginSubmit(login, password);
    } else {
      registerSubmit(login, password, repeatPassword);
    }
  }

  /**
   * Добавление событий на кнопки.
   */
  addEvents(): void {
    this.signInButton.addEventListener('click', () => this.signInMode());
    this.signUpButton.addEventListener('click', () => this.signUpMode());
    this.backButton.addEventListener('click', () => this.prevPage());
    this.submitButton.self()!.addEventListener('click', (e: Event) => this.submitForm(e));

    const debouncedValidate = debounce(this.validate.bind(this), 300);
    this.loginInput.getInput().addEventListener('input', () => debouncedValidate());
    this.passwordInput.getInput().addEventListener('input', () => debouncedValidate());
    this.repeatInput.getInput().addEventListener('input', () => debouncedValidate());
  }
}
