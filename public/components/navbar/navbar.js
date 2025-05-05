import Icon from '../icon/icon.js';
import Button from '../universal_button/button.js';
import template from './navbar.hbs';
import { router } from 'public/modules/router.ts';
import UniversalModal from 'components/modal/modal';
import UserPageStore from 'store/UserPageStore';
import NavbarStore from 'store/NavbarStore';
import { favoriteToggle, logoutUser, searchToggle, genresToggle } from 'flux/Actions';
import { Tabs } from 'components/Tab/Tab';
import Dropdown from 'components/Dropdown/dropdown';

const logoSvg = '/static/svg/logo_text_border_lining.svg';
const userSvg = '/static/svg/Avatar large.svg';
const searchSvg = '/static/svg/search.svg';
const menuSvg = '/static/svg/menu.svg';

export const TABS_DATA = {
  tabsData: [
    {
      id: 'favorites',
      label: 'Избранное',
      onClick: () => {
        router.go('/profile');
        favoriteToggle();
      }
    },
    {
      id: 'genres',
      label: 'Жанры',
      onClick: () => {
        router.go('/genres');
        genresToggle();
      }
    },
    {
      id: 'search',
      label: 'Поиск',
      onClick: () => {
        router.go('/search');
        searchToggle();
      }
    }
  ]
};

const dropdownConfig = {
  id: 'userDropdown',
  parent: document.getElementById('root'),
  items: [
    {
      id: 'profile',
      label: 'Профиль',
      visible: true,
      onClick: () => {
        router.go('/profile', UserPageStore.getState().userData);
      }
    },
    {
      id: 'favorites',
      label: 'Избранное',
      visible: false,
      onClick: () => {
        router.go('/profile');
        favoriteToggle();
      }
    },
    {
      id: 'genres',
      label: 'Жанры',
      visible: false,
      onClick: () => {
        router.go('/genres');
        genresToggle();
      }
    },
    {
      id: 'search',
      label: 'Поиск',
      visible: false,
      onClick: () => {
        router.go('/search');
        searchToggle();
      }
    },
    {
      id: 'logout',
      label: 'Выход',
      visible: true,
      onClick: () => {
        const modal = new UniversalModal(document.body, {
          title: 'Подтверждение действия',
          message: 'Вы уверены, что хотите выйти?',
          confirmText: 'Да',
          cancelText: 'Нет',
          onConfirm: () => {
            logoutUser();
            router.go('/');
          },
          addClasses: ['login_modal']
        });

        modal.render();
        modal.open();
      }
    }
  ]
};

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
      this.user.parent().classList.remove('login__user');
      this.user.destroy();
      // this.LogoutButton.destroy();
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
      this.LoginButton.parent().classList.add('logout__user');
    } else {
      this.LoginButton.parent().classList.remove('logout__user');
      this.LoginButton.destroy();
      this.searchIcon.render();
      this.user.changeConfig({
        text: userData.username,
        srcIcon: UserPageStore.getState().userData?.avatar || userSvg
      });
      this.user.render();
      this.user.parent().classList.add('login__user');
      this.tabs.render();
      // this.LogoutButton.render();
      // this.LogoutButton.self().classList.add('navbar__button');
    }
    if (state.needTabID) {
      this.tabs.activateTabByIdDirect(state.needTabID);
    }
  }

  self() {
    return document.querySelector('.navbar');
  }

  destroy() {
    NavbarStore.unsubscribe(this.bindedHandleStoreChange);
    this.logo.destroy();
    this.user.destroy();
    this.LoginButton?.destroy();
    this.userDropdown.destroy();
    // this.LogoutButton?.destroy();

    this.self()?.remove();
  }

  #elements() {
    return document.querySelector('.navbar_elements');
  }

  render() {
    if (!this.#parent) {
      return;
    }

    this.userDropdown = new Dropdown(dropdownConfig);
    this.userDropdown.render();

    const navbar = document.createElement('navbar');
    navbar.classList.add('navbar');
    this.#parent.appendChild(navbar);
    navbar.innerHTML = template();

    const leftContainer = document.createElement('div');
    leftContainer.classList.add('navbar__left');
    this.#elements().appendChild(leftContainer);

    const navbarLogo = document.createElement('div');
    navbarLogo.classList.add('navbar__logo');
    navbarLogo.style.height = '40px';
    leftContainer.appendChild(navbarLogo);

    const navbarTabs = document.createElement('div');
    navbarTabs.classList.add('navbar__tabs');
    leftContainer.appendChild(navbarTabs);
    this.tabs = new Tabs(navbarTabs, TABS_DATA.tabsData);

    this.searchIcon = new Icon(leftContainer, {
      id: 'searchIcon',
      srcIcon: searchSvg,
      size: 'small'
    });
    this.searchIcon.setActions({
      click: () => {
        router.go('/search');
        searchToggle();
      }
    });

    this.logo = new Icon(navbarLogo, {
      id: 'navbarLogo',
      srcIcon: logoSvg
    });

    this.logo.setActions({ click: () => router.go('/') });

    this.logo.render();

    const navbarUser = document.createElement('div');
    navbarUser.classList.add('navbar__user', 'flex-box-row');
    this.#elements().appendChild(navbarUser);

    const navbarMenu = document.createElement('div');
    navbarMenu.classList.add('navbar__menu');
    this.#elements().appendChild(navbarMenu);

    this.menu = new Icon(navbarMenu, {
      id: 'menuIcon',
      srcIcon: menuSvg,
      size: 'medium'
    });
    this.menu.setActions({
      click: async (e) => {
        e.stopPropagation();
        this.userDropdown.toggle(e.currentTarget);
      }
    });
    this.menu.render();

    // const logout = async () => {
    //   logoutUser();
    //   router.go('/');
    // };

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

    // this.LogoutButtonAction = {
    //   click: async () => {
    //     const modal = new UniversalModal(this.#parent, {
    //       title: 'Подтверждение действия',
    //       message: 'Вы уверены, что хотите выйти?',
    //       confirmText: 'Да',
    //       cancelText: 'Нет',
    //       onConfirm: () => {
    //         logout();
    //       },
    //       addClasses: ['login_modal']
    //     });

    //     modal.render();
    //     modal.open();
    //   }
    // };

    // this.LogoutButton = new Button(navbarUser, {
    //   id: 'logoutbtn',
    //   text: 'Выйти',
    //   actions: this.LogoutButtonAction
    // });

    this.user = new Icon(navbarUser, {
      id: 'user',
      // srcIcon: userSvg,
      srcIcon: UserPageStore.getState().userData?.avatar || userSvg,
      size: 'large',
      text: UserPageStore.getState().userData?.username,
      textColor: 'secondary',
      circular: true,
      direction: 'row'
    });

    this.user.setActions({
      click: async (e) => {
        e.stopPropagation();
        this.userDropdown.toggle(e.currentTarget);
        // this.userDropdown.toggle(this.user.self());
      }
    });

    if (!UserPageStore.getState().userData?.username) {
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
      this.LoginButton.parent().classList.add('logout__user');
    } else {
      this.searchIcon.render();
      this.user.render();
      this.user.parent().classList.add('login__user');
      this.tabs.render();
      // this.LogoutButton.render();
      // this.LogoutButton.self().classList.add('navbar__button');
    }

    // window.addEventListener('resize', () => {
    //   if (window.innerWidth < 950) {
    //     this.userDropdown.updateItemVisibility('favorites', true);
    //     this.userDropdown.updateItemVisibility('genres', true);
    //     this.userDropdown.updateItemVisibility('search', true);
    //   } else {
    //     this.userDropdown.updateItemVisibility('favorites', false);
    //     this.userDropdown.updateItemVisibility('genres', false);
    //     this.userDropdown.updateItemVisibility('search', false);
    //   }
    // });
  }
}

export default Navbar;
