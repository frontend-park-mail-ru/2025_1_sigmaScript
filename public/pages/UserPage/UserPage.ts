import { createID } from 'utils/createID';
import template from './UserPage.hbs';
import { Tabs } from 'components/Tab/Tab';
import Button from 'components/universal_button/button.js';
import { AVATAR_PLACEHOLDER } from 'public/consts';
import { UserData, UserPageData, ButtonConfig, UserPageState } from 'types/UserPage.types';
import UserPageStore from 'store/UserPageStore';
import Navbar from 'components/navbar/navbar';
import { FOOTER_CONFIG } from '../../consts.js';
import { Footer } from 'components/Footer/Footer';
import UniversalModal from 'components/modal/modal';
import { updateUser, updateUserAvatar } from 'flux/Actions';
import { FooterData } from 'types/Footer.types';
import { UniversalModalConfig } from 'types/Modal.types';

export const TABS_DATA = {
  tabsData: [
    { id: 'collections', label: 'Подборки' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'favorites', label: 'Любимые фильмы' }
  ]
};

export class UserPage {
  #parent: HTMLElement;
  #data: UserPageData;
  #id: string;
  #navbar: Navbar | null;
  private bindedHandleStoreChange: (state: UserPageState) => void;

  /**
   * Создает новую страницу пользователя.
   * @param {HTMLElement} parent Родительский элемент, куда будет вставлена страница.
   * @param {UserData} userData Объект с данными пользователя.
   */
  constructor(parent: HTMLElement, userData: UserData) {
    this.#parent = parent;
    this.#id = 'userPage--' + createID();
    this.#data = {
      id: this.#id,
      ...TABS_DATA,
      ...userData,
      avatar: userData?.avatar || AVATAR_PLACEHOLDER
    };
    this.#navbar = null;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    UserPageStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Обработка изменений состояния в AuthStore.
   * @param {AuthState} state - текущее состояние авторизации из Store
   */
  handleStoreChange(state: UserPageState) {
    this.#data.username = state.userData?.username || this.#data.username;
    this.#data.createdAt = state.userData?.createdAt || this.#data.createdAt;
    this.#data.avatar = state.userData?.avatar || AVATAR_PLACEHOLDER;
    this.#data.moviesCount = state.userData?.moviesCount;
    this.#data.rating = state.userData?.rating;
    this.update();
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Возвращает данные для шаблона.
   * @returns {UserPageData}
   */
  get data(): UserPageData {
    return this.#data;
  }

  /**
   * Проверяет, определен ли родительский элемент.
   * @returns {boolean}
   */
  parentDefined(): boolean {
    return !!this.#parent;
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    if (this.parentDefined()) {
      return document.getElementById(this.#id);
    }
    return null;
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    UserPageStore.unsubscribe(this.bindedHandleStoreChange);
    this.self()?.remove();
    this.#navbar?.destroy();
  }

  /**
   * Рисует компонент на экран.
   */
  async render(): Promise<void> {
    if (!this.parentDefined()) {
      return;
    }
    this.#parent.innerHTML = '';
    const mainElem = document.createElement('main');
    mainElem.id = this.#id;
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElem.appendChild(mainElemHeader);

    this.#navbar = new Navbar(mainElemHeader);
    this.#navbar.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList += 'content';
    mainElem.appendChild(mainElemContent);

    mainElemContent.innerHTML += template(this.#data);

    const buttonContainer = this.self()?.querySelector(`.user-page__action-button`);
    if (buttonContainer) {
      const buttonConfig: ButtonConfig = {
        id: 'changeDataBtn',
        color: 'primary',
        text: 'Изменить данные',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Редактирование данных',
              message: 'Измените логин и/или пароль',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              addClasses: ['user-page_modal'],
              inputs: [
                {
                  id: 'loginInput',
                  name: 'login',
                  placeholder: 'Введите новый логин',
                  type: 'text',
                  text: UserPageStore.getState().userData?.username
                },
                {
                  id: 'oldPasswordInput',
                  name: 'oldPassword',
                  placeholder: 'Введите старый пароль',
                  type: 'password'
                },
                {
                  id: 'newPasswordInput',
                  name: 'newPassword',
                  placeholder: 'Введите новый пароль',
                  type: 'password'
                },
                {
                  id: 'repeatedNewPasswordInput',
                  name: 'repeatedNewPassword',
                  placeholder: 'Повторите новый пароль',
                  type: 'password'
                }
              ],
              onConfirm: () => {
                const username = modal.getInputByName('login').getValue();
                const oldPassword = modal.getInputByName('oldPassword').getValue();
                const newPassword = modal.getInputByName('newPassword').getValue();
                const repeatedNewPassword = modal.getInputByName('repeatedNewPassword').getValue();
                updateUser({ username, oldPassword, newPassword, repeatedNewPassword });
              }
            } as UniversalModalConfig);
            modal.render();
            modal.open();
            // modal.self()?.classList.add('user-page_modal');
          }
        }
      };

      const changeUserAvatarButtonConfig: ButtonConfig = {
        id: 'changeAvatarBtn',
        color: 'primary',
        text: 'Изменить аватар',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Редактирование данных',
              message: 'Измените логин и/или пароль',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              inputs: [
                {
                  id: 'modalAvatarImageInput',
                  name: 'modalAvatarImage',
                  type: 'file'
                }
              ],
              onConfirm: () => {
                let selectedFile = null;
                const modalAvatarImageInput = document.getElementsByName('modalAvatarImage')[0] as HTMLInputElement;
                if (modalAvatarImageInput && modalAvatarImageInput.files) {
                  selectedFile = modalAvatarImageInput.files[0];
                }

                if (!selectedFile) {
                  // TODO error handle
                  // alert('Выберите изображение вашего нового аватара');
                } else {
                  updateUserAvatar(selectedFile);
                }
              }
            } as UniversalModalConfig);

            modal.render();
            modal.open();
          }
        }
      };

      new Button(buttonContainer, buttonConfig).render();
      new Button(buttonContainer, changeUserAvatarButtonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      new Tabs(tabsContainer, this.data.tabsData).render();
    }

    const footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    footer.render();
  }

  update() {
    const contentElement = this.#parent.querySelector('.content');
    if (contentElement) {
      contentElement.innerHTML = template(this.#data);
    }
    const buttonContainer = this.self()?.querySelector(`.user-page__action-button`);
    if (buttonContainer) {
      const changeUserDataButtonConfig: ButtonConfig = {
        id: 'changeDataBtn',
        color: 'primary',
        text: 'Изменить данные',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Редактирование данных',
              message: 'Измените логин и/или пароль',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              addClasses: ['user-page_modal'],
              inputs: [
                {
                  id: 'loginInput',
                  name: 'login',
                  placeholder: 'Введите новый логин',
                  type: 'text',
                  text: UserPageStore.getState().userData?.username
                },
                {
                  id: 'oldPasswordInput',
                  name: 'oldPassword',
                  placeholder: 'Введите старый пароль',
                  type: 'password'
                },
                {
                  id: 'newPasswordInput',
                  name: 'newPassword',
                  placeholder: 'Введите новый пароль',
                  type: 'password'
                },
                {
                  id: 'repeatedNewPasswordInput',
                  name: 'repeatedNewPassword',
                  placeholder: 'Повторите новый пароль',
                  type: 'password'
                }
              ],
              onConfirm: () => {
                const username = modal.getInputByName('login').getValue();
                const oldPassword = modal.getInputByName('oldPassword').getValue();
                const newPassword = modal.getInputByName('newPassword').getValue();
                const repeatedNewPassword = modal.getInputByName('repeatedNewPassword').getValue();
                updateUser({ username, oldPassword, newPassword, repeatedNewPassword });
              }
            } as UniversalModalConfig);

            modal.render();
            modal.open();
          }
        }
      };

      const changeUserAvatarButtonConfig: ButtonConfig = {
        id: 'changeAvatarBtn',
        color: 'primary',
        text: 'Изменить аватар',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Редактирование данных',
              message: 'Измените логин и/или пароль',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              inputs: [
                {
                  id: 'modalAvatarImageInput',
                  name: 'modalAvatarImage',
                  type: 'file'
                }
              ],
              onConfirm: () => {
                let selectedFile = null;
                const modalAvatarImageInput = document.getElementsByName('modalAvatarImage')[0] as HTMLInputElement;
                if (modalAvatarImageInput && modalAvatarImageInput.files) {
                  selectedFile = modalAvatarImageInput.files[0];
                }

                if (!selectedFile) {
                  // TODO error handle
                  // alert('Выберите изображение вашего нового аватара');
                } else {
                  updateUserAvatar(selectedFile);
                }
              }
            } as UniversalModalConfig);

            modal.render();
            modal.open();
          }
        }
      };

      new Button(buttonContainer, changeUserDataButtonConfig).render();
      new Button(buttonContainer, changeUserAvatarButtonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      new Tabs(tabsContainer, this.data.tabsData).render();
    }
  }
}
