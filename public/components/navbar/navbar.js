import { createID } from '../../utils/createID.js';
import Icon from '../icon/icon.js';
import Button from '/universal_button/button.js';
import { Login } from '/Login/Login.js';
import { AUTH_URL } from '/consts.js';
import Modal from '/modal/modal.js';

const logoSvg = '/svg/logo_text_border_lining.svg';
const userSvg = '/svg/Avatar large.svg';

/**
 * Навигационная панель
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - уникальный id элемента
 * @param {string} config.color - цвет содержимого кнопки
 * @param {boolean} config.disabled - флаг, что кнопка disabled
 * @param {string} config.form - форма, которая отправляется при нажатии кнопки.
 * Кнопка автоматически становится типа submit
 * @param {string} config.srcIcon - путь до иконки, которая будет внутри кнопки
 * @param {string} config.text - текст кнопки
 * @param {string} config.textColor - класс текста кнопки
 * @param {boolean} config.autofocus - автофокус на кнопку
 * @returns {Class}
 * @example
 * const nav = new Navbar(parent);
 */
class Navbar {
  #parent;

  #renderMain = () => {};

  constructor(parent, renderMain) {
    this.#parent = parent;
    this.#renderMain = renderMain;
  }

  self() {
    return document.querySelector('.navbar');
  }

  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }

  #elements() {
    return document.querySelector('.navbar_elements');
  }

  async render() {
    if (!this.#parent) {
      return;
    }
    this.destroy();

    const navbar = document.createElement('navbar');
    navbar.classList.add('navbar');
    this.#parent.appendChild(navbar);
    // eslint-disable-next-line no-undef
    const navbarTempl = Handlebars.templates['navbar.hbs'];
    navbar.innerHTML = navbarTempl({});

    const navbarLogo = document.createElement('div');
    navbarLogo.classList.add('navbar__logo');
    this.#elements().appendChild(navbarLogo);

    const logo = new Icon(navbarLogo, {
      id: 'navbarLogo',
      srcIcon: logoSvg,
      link: '#'
    });
    logo.render();

    const navbarUser = document.createElement('div');
    navbarUser.classList.add('navbar__user', 'flex-box-row');
    this.#elements().appendChild(navbarUser);

    try {
      const url = AUTH_URL + 'session';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      let userInstance = { username: null };
      if (!response.ok) {
        const error = await response.json();
        console.log(error.error || 'Unknown error');
      } else {
        userInstance = await response.json();
        userInstance.username = userInstance.username.split('@')[0];
      }

      const logout = async () => {
        try {
          const url = AUTH_URL + 'logout';
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Unknown error');
          }
          this.#renderMain();
        } catch (err) {
          console.log(err);
        }
      };

      const LoginButtonAction = {
        click: () => {
          const rootElement = document.getElementById('root');
          rootElement.innerHTML = '';
          const login = new Login(rootElement, this.#renderMain);
          login.render();
        }
      };

      const LoginButton = new Button(navbarUser, {
        id: 'loginbtn',
        text: 'Войти',
        actions: LoginButtonAction
      });

      const LogoutButtonAction = {
        click: async () => {
          const modal = new Modal(this.#parent, {
            id: createID(),
            onConfirm: logout
          });
          modal.render();
        }
      };

      const LogoutButton = new Button(navbarUser, {
        id: 'logoutbtn',
        text: 'Выйти',
        actions: LogoutButtonAction
      });

      const user = new Icon(navbarUser, {
        id: 'user',
        srcIcon: userSvg,
        size: 'large',
        text: userInstance.username,
        textColor: 'secondary',
        link: '#',
        circular: true,
        direction: 'row'
      });

      if (!userInstance.username) {
        LoginButton.render();
        LoginButton.self().classList.add('navbar__button');
      } else {
        user.render();
        LogoutButton.render();
        LogoutButton.self().classList.add('navbar__button');
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Navbar;
