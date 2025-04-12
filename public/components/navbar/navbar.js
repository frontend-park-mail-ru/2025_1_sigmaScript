import Icon from '../icon/icon.js';
import Button from '../universal_button/button.js';
import template from './navbar.hbs';
import { router } from 'public/modules/router.ts';
import UniversalModal from 'components/modal/modal';
import UserPageStore from 'store/UserPageStore';
import NavbarStore from 'store/NavbarStore';
import { logoutUser } from 'flux/Actions';

const logoSvg = '/static/svg/logo_text_border_lining.svg';
const userSvg = '/static/svg/Avatar large.svg';

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

  constructor(parent) {
    this.#parent = parent;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    NavbarStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(state) {
    let userData = UserPageStore.getState().userData;
    if (!userData?.username) {
      this.user.destroy();
      this.LogoutButton.destroy();
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
    } else {
      this.LoginButton.destroy();
      this.user.changeConfig({
        text: userData.username
      });
      this.user.render();
      this.LogoutButton.render();
      this.LogoutButton.self().classList.add('navbar__button');
    }
  }

  self() {
    return document.querySelector('.navbar');
  }

  destroy() {
    this.self()?.remove();
  }

  #elements() {
    return document.querySelector('.navbar_elements');
  }

  async render() {
    if (!this.#parent) {
      return;
    }
    // this.destroy();

    const navbar = document.createElement('navbar');
    navbar.classList.add('navbar');
    this.#parent.appendChild(navbar);
    navbar.innerHTML = template();

    const navbarLogo = document.createElement('div');
    navbarLogo.classList.add('navbar__logo');
    navbarLogo.style.height = '40px';

    this.#elements().appendChild(navbarLogo);

    const logo = new Icon(navbarLogo, {
      id: 'navbarLogo',
      srcIcon: logoSvg
    });

    logo.setActions({ click: () => router.go('/') });

    logo.render();

    const navbarUser = document.createElement('div');
    navbarUser.classList.add('navbar__user', 'flex-box-row');
    this.#elements().appendChild(navbarUser);

    const logout = async () => {
      logoutUser();
      router.go('/');
    };

    this.LoginButtonAction = {
      click: () => {
        router.go('/auth');
      }
    };

    this.LoginButton = new Button(navbarUser, {
      id: 'loginbtn',
      text: 'Войти',
      actions: this.LoginButtonAction
    });

    this.LogoutButtonAction = {
      click: async () => {
        const modal = new UniversalModal(this.#parent, {
          title: 'Подтверждение действия',
          message: 'Вы уверены, что хотите выйти?',
          confirmText: 'Да',
          cancelText: 'Нет',
          onConfirm: () => {
            logout();
          }
        });

        modal.render();
        modal.open();
      }
    };

    this.LogoutButton = new Button(navbarUser, {
      id: 'logoutbtn',
      text: 'Выйти',
      actions: this.LogoutButtonAction
    });

    this.user = new Icon(navbarUser, {
      id: 'user',
      srcIcon: userSvg,
      size: 'large',
      text: UserPageStore.getState().userData?.username,
      textColor: 'secondary',
      circular: true,
      direction: 'row'
    });

    this.user.setActions({
      click: async () => {
        router.go('/profile', UserPageStore.getState().userData);
      }
    });

    if (!UserPageStore.getState().userData?.username) {
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
    } else {
      this.user.render();
      this.LogoutButton.render();
      this.LogoutButton.self().classList.add('navbar__button');
    }
  }
}

export default Navbar;
