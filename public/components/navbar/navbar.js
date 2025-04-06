import { createID } from 'utils/createID.ts';
import Icon from '../icon/icon.js';
import Button from '../universal_button/button.js';
import { Login } from '../Login/Login';
import { AUTH_URL } from 'public/consts.js';
import request from 'utils/fetch.ts';
import template from './navbar.hbs';
import Modal from 'components/modal/modal.js';
import { UserPage } from 'pages/UserPage/UserPage';
import { BASE_URL } from 'public/consts';
import { deserialize } from 'utils/Serialize';
import { renderUserPage } from 'flux/Actions';

const logoSvg = 'static/svg/logo_text_border_lining.svg';
const userSvg = 'static/svg/Avatar large.svg';

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

  #formatDate(date) {
    const dateObj = new Date(date);
    const dateOnly = dateObj.toISOString().split('T')[0];
    return dateOnly;
  }

  async render() {
    if (!this.#parent) {
      return;
    }
    this.destroy();

    const navbar = document.createElement('navbar');
    navbar.classList.add('navbar');
    this.#parent.appendChild(navbar);
    navbar.innerHTML = template();

    const navbarLogo = document.createElement('div');
    navbarLogo.classList.add('navbar__logo');
    this.#elements().appendChild(navbarLogo);

    const logo = new Icon(navbarLogo, {
      id: 'navbarLogo',
      srcIcon: logoSvg
    });
    logo.setActions({ click: () => this.#renderMain() });
    logo.render();

    const navbarUser = document.createElement('div');
    navbarUser.classList.add('navbar__user', 'flex-box-row');
    this.#elements().appendChild(navbarUser);

    let userInstance = { username: null };
    try {
      const url = AUTH_URL + 'session';
      const res = await request({ url: url, method: 'GET', credentials: true });
      userInstance = res.body;
      userInstance.username = userInstance.username.split('@')[0];
      localStorage.setItem('username', userInstance.username);
    } catch (error) {
      console.log(error.errorDetails.error || 'Unknown error');
    }

    const logout = async () => {
      try {
        const url = AUTH_URL + 'logout';
        await request({ url: url, method: 'POST', credentials: true });
        this.#renderMain();
      } catch (error) {
        console.log(error.errorDetails.error);
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

    user.setActions({
      click: async () => {
        const parentContainer = document.getElementById('root').querySelector('.content');
        let userData;
        try {
          const url = BASE_URL + `users/${localStorage.getItem('username')}`;
          const res = await request({ url: url, method: 'GET', credentials: true });
          userData = deserialize(res.body);
        } catch (error) {
          // TODO: пофиксить багу в обработке ошибок в request
          // console.log(error.errorDetails.error || 'Unknown error');
          console.log(error || 'Unknown error');
          return;
        }

        // форматируем дату с бека
        userData.createdAt = this.#formatDate(userData.createdAt);
        userData.birthDate = this.#formatDate(userData.birthDate);
        // временное решение пока нету роутера
        const userPage = new UserPage(parentContainer, userData);
        renderUserPage(parentContainer, userData);
      }
    });

    if (!userInstance.username) {
      LoginButton.render();
      LoginButton.self().classList.add('navbar__button');
    } else {
      user.render();
      LogoutButton.render();
      LogoutButton.self().classList.add('navbar__button');
    }
  }
}

export default Navbar;
