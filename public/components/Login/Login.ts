import { createID } from 'utils/createID';
import Button from '../universal_button/button.js';
import Input from '../universal_input/input.js';
import { Switch } from '../Switch/Switch.js';
import { ERRORS, AUTH_URL, ERROR_HANDLERS } from 'public/consts';
import { isValidLogin, isVaidPassword } from 'utils/validate.js';
import { debounce } from 'utils/debounce.js';
import request, { ErrorWithDetails } from 'utils/fetch';
import template from './Login.hbs';

type ErrorHandler = (context: Login, input?: Input) => void;
const TypedERROR_HANDLERS = ERROR_HANDLERS as Record<string, ErrorHandler>;
const TypedERRORS = ERRORS as Record<string, string>;
const typedIsVaidPassword = isVaidPassword as (password: string) => ErrorHandler | undefined | null;

export class Login {
  #parent: HTMLElement;
  #id: string;
  #mode: number;
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

  constructor(parent: HTMLElement, prevPage: () => void, mode: number) {
    this.#parent = parent;
    this.#id = 'login--' + createID();
    this.#mode = mode;
    this.prevPage = prevPage;
  }

  get parent(): HTMLElement {
    return this.#parent;
  }

  setParent(newParent: HTMLElement): void {
    this.#parent = newParent;
  }

  self(): HTMLElement | null {
    return this.#parent ? document.getElementById(this.#id) : null;
  }

  destroy(): void {
    this.self()?.remove();
  }

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

  signInMode(): void {
    this.signInButton.classList.add('active');
    this.signUpButton.classList.remove('active');
    this.repeatInput.self()!.style.visibility = 'hidden';
    this.submitButton.setText('Войти');
    this.#mode = 1;
    this.resetForm();
    this.clearInputs();
  }

  signUpMode(): void {
    this.signInButton.classList.remove('active');
    this.signUpButton.classList.add('active');
    this.repeatInput.self()!.style.visibility = 'visible';
    this.submitButton.setText('Зарегистрироваться');
    this.#mode = 0;
    this.resetForm();
    this.clearInputs();
  }

  showError(firstInput: Input, message: string, secondInput: Input) {
    firstInput.getErrorContainer().innerHTML = message;
    firstInput.getInput().classList.add('error');
    secondInput?.getInput().classList.add('error');
  }

  removeError(input: Input): void {
    input.getErrorContainer().innerHTML = '';
    input.getInput().classList.remove('error');
  }

  resetForm(): void {
    this.removeError(this.loginInput);
    this.removeError(this.passwordInput);
    this.removeError(this.repeatInput);
    this.submitButton.disable();
  }

  clearInputs(): void {
    this.loginInput.clearInput();
    this.passwordInput.clearInput();
    this.repeatInput.clearInput();
  }

  validateLogin(): boolean {
    const handler = isValidLogin(this.loginInput.getValue().trim());
    if (handler) {
      handler(this);
      return false;
    }
    this.removeError(this.loginInput);
    return true;
  }

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

  validate(): void {
    this.resetForm();
    if (this.validateLogin() && this.validatePassword()) {
      this.submitButton.enable();
    } else {
      this.submitButton.disable();
    }
  }

  async submitForm(e: Event): Promise<void> {
    e.preventDefault();
    this.resetForm();

    const login = this.loginInput.getValue().trim();
    const pass = this.passwordInput.getValue();
    const repeatPass = this.repeatInput.getValue();

    try {
      const url = AUTH_URL + (this.#mode === 1 ? 'login' : 'register');
      const body = {
        username: login,
        password: pass,
        repeated_password: repeatPass
      };
      await request({ url, method: 'POST', body, credentials: true });
      this.prevPage();
    } catch (error: unknown) {
      if (error instanceof ErrorWithDetails) {
        const err = error.errorDetails?.error;
        this.lastInput = this.#mode === 1 ? this.passwordInput : this.repeatInput;

        for (const [key, handler] of Object.entries(ERROR_HANDLERS) as Array<[string, (ctx: Login) => void]>) {
          if (err?.includes(key)) {
            handler(this);
            return;
          }
        }
        ERROR_HANDLERS[ERRORS.ErrDefault](this);
      } else {
        console.error("Request error: can't handle catch block error");
      }
    }
  }

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
