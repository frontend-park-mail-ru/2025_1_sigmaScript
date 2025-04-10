import { createID } from 'utils/createID';
import template from './UserPage.hbs';
import { Tabs } from 'components/Tab/Tab';
import Button from 'components/universal_button/button.js';
import { AVATAR_PLACEHOLDER } from 'public/consts';
import { UserData, UserPageData, ButtonConfig, UserPageState } from 'types/UserPage.types';
import UserPageStore from 'store/UserPageStore';
import Navbar from 'components/navbar/navbar';
import { FOOTER_CONFIG } from 'public/consts.js';
import { Footer } from 'components/Footer/Footer';

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
        textColor: 'primary'
        // TODO: сделать модалку с изменением данных
        // actions: {
        //   click: async () => {
        //     console.log('button');
        //   }
        // }
      };

      new Button(buttonContainer, buttonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      new Tabs(tabsContainer, this.data.tabsData).render();
    }

    const footer = new Footer(mainElem, FOOTER_CONFIG);
    footer.render();
  }

  update() {
    const contentElement = this.#parent.querySelector('.content');
    if (contentElement) {
      contentElement.innerHTML = template(this.#data);
    }
    const buttonContainer = this.self()?.querySelector(`.user-page__action-button`);
    if (buttonContainer) {
      const buttonConfig: ButtonConfig = {
        id: 'changeDataBtn',
        color: 'primary',
        text: 'Изменить данные',
        textColor: 'primary'
        // TODO: сделать модалку с изменением данных
        // actions: {
        //   click: async () => {
        //     console.log('button');
        //   }
        // }
      };

      new Button(buttonContainer, buttonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      new Tabs(tabsContainer, this.data.tabsData).render();
    }
  }
}
