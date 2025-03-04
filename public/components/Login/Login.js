import { createID } from '/createID.js';
import { Button } from '/Button/Button.js';
import { Input } from '/Input/Input.js';
import { Switch } from '/Switch/Switch.js';
import { AUTH_URL } from '/consts.js';
import { ERRORS } from '/consts.js';
import { ERROR_HANDLERS } from '/consts.js';
import { isValidEmail } from '/validate.js';
import { isVaidPassword } from '/validate.js';
import { debounce } from '/debounce.js';

export class Login {
    #parent;
    #id;
    #mode;

    /**
     * Создаёт новую форму входа/регистрации.
     * @param {HTMLElement} parent В какой элемент вставлять
     * @param {Function} prevPage Функция перехода на предыдущую страницу.
     * @param {boolean} mode Поле для сохранения состояния - вход или регистрация.
     */
    constructor(parent, prevPage, mode) {
        this.#parent = parent;
        this.#id = 'login--' + createID();
        this.#mode = mode; // sign up - 0, sign in - 1
        this.prevPage = prevPage;
    }

    /**
     * Возвращает родителя.
     * @returns {HTMLElement}
     */
    get parent() {
        return this.#parent;
    }

    /**
     * Задаем родителя.
     */
    setParent(newParent) {
        this.#parent = newParent;
    }

    /**
     * Проверяет на наличие родителя.
     * @returns {boolean}
     */
    parentDefined() {
        return !(this.#parent === null || this.#parent === undefined);
    }

    /**
     * Возвращает себя из DOM.
     * @returns {HTMLElement}
     */
    self() {
        if (this.parentDefined()) {
            return document.getElementById(this.#id);
        }
    }

    /**
     * Удаляет отрисованные элементы.
     */
    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    /**
     * Рисует компонент на экран.
     */
    render() {
        this.destroy();
        if (!this.parentDefined()) {
            return;
        }
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates['Login.hbs'];
        this.#parent.innerHTML += template({ id: this.#id });

        this.switch = new Switch(this.self(), 'Вход', 'Регистрация');
        this.emailInput = new Input(this.self(), 'email', 'email', 'Email');
        this.passwordInput = new Input(this.self(), 'password', 'password', 'Пароль');
        this.repeatInput = new Input(this.self(), 'password', 'rep_password', 'Повторите пароль');
        this.submitButton = new Button(this.self(), 'submit', 'Регистрация');

        this.switch.render();
        this.emailInput.render();
        this.passwordInput.render();
        this.repeatInput.render();
        this.submitButton.render();

        this.signInButton = this.switch.self().querySelector('.switch__button--left');
        this.signUpButton = this.switch.self().querySelector('.switch__button--right');
        this.backButton = this.self().querySelector('.login__back');

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
    signInMode() {
        this.signInButton.classList.add('active');
        this.signUpButton.classList.remove('active');
        this.repeatInput.self().style.visibility = 'hidden';
        this.submitButton.self().textContent = 'Войти';
        this.#mode = 1;
        this.resetForm();
        this.clearInputs();
    }

    /**
     * Функция перехода в режим регистрации.
     */
    signUpMode() {
        this.signInButton.classList.remove('active');
        this.signUpButton.classList.add('active');
        this.repeatInput.self().style.visibility = 'visible';
        this.submitButton.self().textContent = 'Зарегистрироваться';
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
    showError(firstInput, message, secondInput) {
        firstInput.getErrorContainer().innerHTML = message;
        firstInput.getInput().classList.add('error');
        secondInput?.getInput().classList.add('error');
    }

    /**
     * Очищает переданное поле ввода от ошибок
     * @param {Input} input - очищаемое поле ввода
     */
    removeError(input) {
        input.getErrorContainer().innerHTML = '';
        input.getInput().classList.remove('error');
    }

    /**
     * Сбрасывает форму
     */
    resetForm() {
        this.removeError(this.emailInput);
        this.removeError(this.passwordInput);
        this.removeError(this.repeatInput);
    }

    /**
     * Очищает поля ввода
     */
    clearInputs() {
        this.emailInput.clearInput();
        this.passwordInput.clearInput();
        this.repeatInput.clearInput();
    }

    /**
     * Валидация почты
     * @returns {bool}
     */
    validateEmail() {
        let handler = isValidEmail(this.emailInput.getValue().trim());
        if (handler) {
            handler(this);
            return false;
        }
        this.removeError(this.emailInput);
        return true;
    }

    /**
     * Валидация паролей
     * @returns {bool}
     */
    validatePassword() {
        if (this.#mode === 0 && this.passwordInput.getValue() !== this.repeatInput.getValue()) {
            ERROR_HANDLERS[ERRORS.ErrPasswordsMismatchShort](this);
            return false;
        }
        let handler = isVaidPassword(this.passwordInput.getValue());
        if (handler) {
            handler(this);
            return false;
        } else {
            this.removeError(this.passwordInput);
        }
        handler = isVaidPassword(this.repeatInput.getValue());
        if (this.#mode === 0 && handler) {
            handler(this);
            return false;
        } else {
            this.removeError(this.repeatInput);
        }
        return true;
    }

    /**
     * Валидация полей ввода
     */
    validate() {
        this.resetForm();
        if (this.validateEmail() && this.validatePassword()) {
            this.submitButton.enable();
        } else {
            this.submitButton.disable();
        }
    }

    /**
     * Отправка формы
     * @param {Event} e - событие формы
     */
    async submitForm(e) {
        e.preventDefault();
        this.resetForm();

        const email = this.emailInput.getValue().trim();
        const pass = this.passwordInput.getValue();
        const repeatPass = this.repeatInput.getValue();

        try {
            const url = AUTH_URL + (this.#mode === 1 ? 'login/' : 'register/');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: pass,
                    repeated_password: repeatPass
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Unknown error');
            }
            this.prevPage();
        } catch (error) {
            const err = error.message;
            this.lastInput = '';

            if (this.#mode === 1) {
                this.lastInput = this.passwordInput;
            } else {
                this.lastInput = this.repeatInput;
            }

            for (const [key, handler] of Object.entries(ERROR_HANDLERS)) {
                if (err.includes(key)) {
                    console.log(key);
                    handler(this);
                    return;
                }
            }
            ERROR_HANDLERS[ERRORS.ErrDefault](this);
        }
    }

    /**
     * Добавление событий на кнопки.
     */
    addEvents() {
        this.signInButton.addEventListener('click', () => {
            this.signInMode();
        });

        this.signUpButton.addEventListener('click', () => {
            this.signUpMode();
        });

        this.backButton.addEventListener('click', () => {
            this.prevPage();
        });

        this.submitButton.self().addEventListener('click', (e) => {
            this.submitForm(e);
        });

        const debouncedValidate = debounce(this.validate.bind(this), 300);

        this.emailInput.getInput().addEventListener('input', debouncedValidate);
        this.passwordInput.getInput().addEventListener('input', debouncedValidate);
        this.repeatInput.getInput().addEventListener('input', debouncedValidate);
    }
}
