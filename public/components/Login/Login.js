import { createID } from '/createID.js';
import { Button } from '/Button/Button.js';
import { Input } from '/Input/Input.js';
import { Switch } from '/Switch/Switch.js';

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
    }

    /**
     * Функция перехода в режим регистрации.
     */
    signUpMode() {
        this.signInButton.classList.remove('active');
        this.signUpButton.classList.add('active');
        this.repeatInput.self().style.visibility = 'visible';
        this.submitButton.self().textContent = 'Зарегистрироваться';
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
    }
}
