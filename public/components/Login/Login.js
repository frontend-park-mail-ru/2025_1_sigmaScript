import { Button } from '/Button/Button.js';
import { Input } from '/Input/Input.js';
import { Switch } from '/Switch/Switch.js';

export class Login {
    #parent;
    #id;
    constructor(parent) {
        this.#parent = parent;
        this.#id = 'login' + crypto.randomUUID();
    }

    get parent() {
        return this.#parent;
    }

    setParent(newParent) {
        this.#parent = newParent;
    }

    self() {
        return document.querySelector('.' + this.#id);
    }

    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    addEvents() {
        const signInButton = this.switch.self().querySelector('.switch__button--left');
        const signUpButton = this.switch.self().querySelector('.switch__button--right');

        signInButton.addEventListener('click', () => {
            signInButton.style.backgroundColor = '#7F5AF0';
            signUpButton.style.backgroundColor = 'inherit';
            this.repeatInput.self().style.visibility = 'hidden';
            this.submitButton.self().textContent = 'Войти';
        });

        signUpButton.addEventListener('click', () => {
            signUpButton.style.backgroundColor = '#7F5AF0';
            signInButton.style.backgroundColor = 'inherit';
            this.repeatInput.self().style.visibility = 'visible';
            this.submitButton.self().textContent = 'Зарегистрироваться';
        });
    }

    render() {
        this.destroy();
        if (this.#parent === null || this.#parent === undefined) {
            return;
        }
        const template = Handlebars.templates['Login.hbs'];
        this.#parent.innerHTML += template({ id: this.#id });

        this.switch = new Switch(this.self(), 'Вход', 'Регистрация');
        this.emailInput = new Input(this.self(), 'email', 'email', 'Логин');
        this.passwordInput = new Input(this.self(), 'password', 'password', 'Пароль');
        this.repeatInput = new Input(this.self(), 'password', 'rep_password', 'Повторите пароль');
        this.submitButton = new Button(this.self(), 'submit', 'Регистрация');

        this.switch.render();
        this.emailInput.render();
        this.passwordInput.render();
        this.repeatInput.render();
        this.submitButton.render();

        this.addEvents();
    }
}
