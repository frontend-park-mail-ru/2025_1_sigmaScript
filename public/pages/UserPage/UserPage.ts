import { createID } from 'utils/createID';
import template from './UserPage.hbs';
import { Tabs } from 'components/Tab/Tab';
import Button from 'components/universal_button/button.js';
import { AVATAR_PLACEHOLDER } from 'public/consts';
import { UserData, UserPageData, ButtonConfig, UserPageState } from 'types/UserPage.types';
import UserPageStore from 'store/UserPageStore';

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
      avatar: userData.avatar || AVATAR_PLACEHOLDER
    };

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    UserPageStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Обработка изменений состояния в AuthStore.
   * @param {AuthState} state - текущее состояние авторизации из Store
   */
  handleStoreChange(state: UserPageState) {
    const { parent, userData } = state;

    let shouldRender = false;

    if (parent && parent !== this.#parent) {
      this.#parent = parent;
      shouldRender = true;
    }

    if (userData && JSON.stringify(userData) !== JSON.stringify(this.#data)) {
      this.#data = {
        ...this.#data,
        ...userData,
        ...TABS_DATA,
        avatar: userData.avatar || AVATAR_PLACEHOLDER
      };
      shouldRender = true;
    }

    if (shouldRender) {
      this.render();
    }
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
  }

  /**
   * Рисует компонент на экран.
   */
  async render(): Promise<void> {
    if (!this.parentDefined()) {
      return;
    }

    this.#parent.innerHTML = template(this.#data);

    const buttonContainer = this.self()?.querySelector(`.user-page__action-button`);
    if (buttonContainer) {
      const buttonConfig: ButtonConfig = {
        id: 'changeDataBtn',
        color: 'primary',
        text: 'Изменить данные',
        textColor: 'primary',
        actions: {
          click: async () => {
            console.log('button');
          }
        }
      };

      new Button(buttonContainer, buttonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      new Tabs(tabsContainer, this.data.tabsData).render();
    }
  }
}
