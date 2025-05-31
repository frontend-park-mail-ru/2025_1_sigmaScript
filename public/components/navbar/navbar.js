import Icon from '../icon/icon.js';
import Button from '../universal_button/button.js';
import template from './navbar.hbs';
import { router } from 'public/modules/router.ts';
import UniversalModal from 'components/modal/modal';
import UserPageStore from 'store/UserPageStore';
import NotificationStore from 'store/NotificationStore';
import NavbarStore from 'store/NavbarStore';
import { favoriteToggle, logoutUser, searchToggle, genresToggle, removeNotification } from 'flux/Actions';
import { Tabs } from 'components/Tab/Tab';
import Dropdown from 'components/Dropdown/dropdown';
import NotificationDropdown from 'components/NotificationDropdown/NotiDropdown';

const logoSvg = '/static/svg/logo_text_border_lining.svg';
const userSvg = '/static/svg/Avatar large.svg';
const searchSvg = '/static/svg/search.svg';
const menuSvg = '/static/svg/menu.svg';
const notificationSvg = '/static/svg/notification.svg';

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

class Navbar {
  #parent;

  constructor(parent) {
    this.#parent = parent;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    this.bindedHandleNotificationStoreChange = this.handleNotificationStoreChange.bind(this);

    NavbarStore.subscribe(this.bindedHandleStoreChange);
    NotificationStore.subscribe(this.bindedHandleNotificationStoreChange);
  }

  handleStoreChange(state) {
    let userData = UserPageStore.getState().userData;

    if (!this.user || !this.LoginButton) {
      return;
    }

    if (!userData?.username) {
      if (this.user.parent) {
        this.user.parent().classList.remove('login__user');
      }
      this.user.destroy();
      this.notificationIcon?.destroy();
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
      if (this.LoginButton.parent) {
        this.LoginButton.parent().classList.add('logout__user');
      }
    } else {
      if (this.LoginButton.parent) {
        this.LoginButton.parent().classList.remove('logout__user');
      }
      this.LoginButton.destroy();
      this.searchIcon?.render();
      this.notificationIcon?.render();
      this.user.changeConfig({
        text: userData.username,
        srcIcon: UserPageStore.getState().userData?.avatar || userSvg
      });
      this.user.render();
      if (this.user.parent) {
        this.user.parent().classList.add('login__user');
      }
      this.tabs?.render();
      this.updateNotificationBadge();
    }
    if (state.needTabID && this.tabs) {
      this.tabs.activateTabByIdDirect(state.needTabID);
    }
  }

  handleNotificationStoreChange(notificationState) {
    if (this.notificationDropdown) {
      this.notificationDropdown.updateNotifications(notificationState.notifications);
    }

    this.updateNotificationBadge();
  }

  updateNotificationBadge() {
    const wrapper = this.notificationIcon?.self()?.parentElement;
    if (!wrapper) return;

    const existingBadge = wrapper.querySelector('.notification-badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    const count = NotificationStore.getState().notifications.length;

    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'notification-badge';
      wrapper.appendChild(badge);
    }
  }

  self() {
    return document.querySelector('.navbar');
  }

  destroy() {
    NavbarStore.unsubscribe(this.bindedHandleStoreChange);
    NotificationStore.unsubscribe(this.bindedHandleNotificationStoreChange);

    this.logo?.destroy();
    this.user?.destroy();
    this.LoginButton?.destroy();
    this.userDropdown?.destroy();
    this.notificationDropdown?.destroy();
    this.searchIcon?.destroy();
    this.notificationIcon?.destroy();
    this.menu?.destroy();

    this.self()?.remove();
  }

  #elements() {
    return document.querySelector('.navbar_elements');
  }

  render() {
    if (!this.#parent) {
      return;
    }

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
        e.preventDefault();
        e.stopPropagation();
        this.notificationDropdown.close();
        this.userDropdown.toggle(e.currentTarget);
      }
    });
    this.menu.render();

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
          id: 'notifications',
          label: 'Уведомления',
          visible: false,
          onClick: (e) => {
            setTimeout(() => {
              const notificationIcon = this.notificationIcon?.self();
              if (notificationIcon && this.notificationDropdown) {
                e.preventDefault();
                e.stopPropagation();
                this.notificationDropdown.toggle(this.menu.self());
              }
            }, 1);
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

    this.userDropdown = new Dropdown(dropdownConfig);
    this.userDropdown.render();

    const notificationState = NotificationStore.getState();
    const notificationConfig = {
      id: 'notificationDropdown',
      parent: document.getElementById('root'),
      title: 'Уведомления',
      notifications: notificationState.notifications,
      onNotificationClick: (id) => {
        router.go('/movie/' + NotificationStore.getUrlIDbyID(id));
      },
      onNotificationRemove: (id) => {
        removeNotification(id);
      }
    };

    this.notificationDropdown = new NotificationDropdown(notificationConfig);
    this.notificationDropdown.render();

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

    const notificationWrapper = document.createElement('div');
    notificationWrapper.classList.add('icon-wrapper');
    navbarUser.appendChild(notificationWrapper);
    this.notificationIcon = new Icon(notificationWrapper, {
      id: 'notificationIcon',
      srcIcon: notificationSvg,
      size: 'small'
    });
    this.notificationIcon.setActions({
      click: (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.notificationDropdown.toggle(e.currentTarget);
      }
    });

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

    this.user = new Icon(navbarUser, {
      id: 'user',
      srcIcon: UserPageStore.getState().userData?.avatar || userSvg,
      size: 'large',
      text: UserPageStore.getState().userData?.username,
      textColor: 'secondary',
      circular: true,
      direction: 'row'
    });

    this.user.setActions({
      click: async (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.userDropdown.toggle(e.currentTarget);
      }
    });

    if (!UserPageStore.getState().userData?.username) {
      this.LoginButton.render();
      this.LoginButton.self().classList.add('navbar__button');
      if (this.LoginButton.parent) {
        this.LoginButton.parent().classList.add('logout__user');
      }
      this.tabs.render();
      this.tabs.hideAllTabs();
      this.tabs.showTabById('genres');
      this.tabs.showTabById('search');
      this.searchIcon.render();
    } else {
      this.searchIcon.render();
      this.notificationIcon.render();
      this.user.render();
      if (this.user.parent) {
        this.user.parent().classList.add('login__user');
      }
      this.tabs.render();
      this.updateNotificationBadge();
    }
  }
}

export default Navbar;
