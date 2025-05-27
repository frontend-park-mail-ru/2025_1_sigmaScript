import { createID } from 'utils/createID';
import template from './UserPage.hbs';
import reviewTemplate from './review.hbs';
import { Tabs } from 'components/Tab/Tab';
import Button from 'components/universal_button/button.js';
import { AVATAR_PLACEHOLDER } from 'public/consts';
import {
  UserData,
  UserPageData,
  ButtonConfig,
  UserPageState,
  MoviesMap,
  ActorsMap,
  ReviewsMap
} from 'types/UserPage.types';
import UserPageStore from 'store/UserPageStore';
import Navbar from 'components/navbar/navbar';
import { ALLOWED_MIME_TYPES, FOOTER_CONFIG } from '../../consts.js';
import { Footer } from 'components/Footer/Footer';
import UniversalModal from 'components/modal/modal';
import { PopupActions, updateLogin, updatePassword, updateUserAvatar } from 'flux/Actions';
import { FooterData } from 'types/Footer.types';
import { UniversalModalConfig } from 'types/Modal.types';
import Scroll from 'components/Scroll/Scroll';
import MovieCard from 'components/Card/Card';
import { Urls } from 'modules/router';
import { EmptyState } from 'components/EmptyState/EmptyState';

export const TABS_DATA = {
  tabsData: [
    {
      id: 'favorites',
      label: 'Избранное',
      onClick: () => {
        const contentDiv = document.querySelector('.user-page__content') as HTMLElement;
        if (!contentDiv) return;
        contentDiv.innerHTML = '';

        const moviesSection = document.createElement('div');
        moviesSection.classList.add('favorites-section', 'favorites-section--movies');
        contentDiv.appendChild(moviesSection);

        const moviesTitle = document.createElement('h4');
        moviesTitle.textContent = 'Фильмы';
        moviesTitle.classList.add('favorites-section__title');
        moviesSection.appendChild(moviesTitle);

        const movieCollection = UserPageStore.getState().movieCollection as MoviesMap;

        if (!movieCollection || movieCollection.size === 0) {
          const emptyState = new EmptyState(moviesSection, {
            description: 'Вы пока не добавили ни одного фильма в избранное. Найдите интересные фильмы и добавьте их!'
          });
          emptyState.render();
          const emptyStateElement = moviesSection.querySelector('.empty-state') as HTMLElement;
          if (emptyStateElement) {
            emptyStateElement.style.textAlign = 'left';
          }
        } else {
          const moviesScroll = new Scroll(moviesSection);
          moviesScroll.render();
          const moviesContainer = moviesScroll.getContentContainer();
          if (moviesContainer) {
            for (const [id, movie] of movieCollection) {
              new MovieCard(moviesContainer, {
                id: `movieCard--${id}`,
                title: movie.title,
                url: `${Urls.movie}/${id}`,
                previewUrl: movie.preview_url || '/static/img/default_preview.webp',
                width: '130',
                height: '180'
              }).render();
            }
          }
        }

        const actorsSection = document.createElement('div');
        actorsSection.classList.add('favorites-section', 'favorites-section--actors');
        contentDiv.appendChild(actorsSection);

        const actorsTitle = document.createElement('h4');
        actorsTitle.textContent = 'Актёры';
        actorsTitle.classList.add('favorites-section__title');
        actorsSection.appendChild(actorsTitle);

        const actorCollection = UserPageStore.getState().actorCollection as ActorsMap;

        if (!actorCollection || actorCollection.size === 0) {
          const emptyState = new EmptyState(actorsSection, {
            description:
              'Вы пока не добавили ни одного актёра в избранное. Изучайте фильмографии и находите любимых актёров!'
          });
          emptyState.render();
          const emptyStateElement = actorsSection.querySelector('.empty-state') as HTMLElement;
          if (emptyStateElement) {
            emptyStateElement.style.textAlign = 'left';
          }
        } else {
          const actorsScroll = new Scroll(actorsSection);
          actorsScroll.render();
          const actorsContainer = actorsScroll.getContentContainer();
          if (actorsContainer) {
            for (const [id, actor] of actorCollection) {
              new MovieCard(actorsContainer, {
                id: `actorCard--${id}`,
                title: actor.nameRu as string,
                url: `${Urls.person}/${id}`,
                previewUrl: actor.photoUrl || '/static/img/default_person.webp',
                width: '130',
                height: '180'
              }).render();
            }
          }
        }
      }
    },
    {
      id: 'reviews',
      label: 'Мои отзывы',
      onClick: () => {
        const contentDiv = document.querySelector('.user-page__content') as HTMLElement;
        contentDiv.innerHTML = '';

        const reviewsDiv: HTMLDivElement = document.createElement('div');
        contentDiv.appendChild(reviewsDiv);
        reviewsDiv.className = 'movie-page__reviews flex-dir-col flex-start';

        const reviews = UserPageStore.getState().reviews as ReviewsMap;

        if (!reviews || reviews.size === 0) {
          const emptyState = new EmptyState(reviewsDiv, {
            description:
              'Вы пока не оставили ни одного отзыва. Поделитесь своими впечатлениями о просмотренных фильмах!'
          });
          emptyState.render();
          const emptyStateElement = reviewsDiv.querySelector('.empty-state') as HTMLElement;
          if (emptyStateElement) {
            emptyStateElement.style.textAlign = 'left';
          }
        } else {
          for (const review of reviews.values()) {
            reviewsDiv.innerHTML += reviewTemplate(review);
          }
        }
      }
    }
  ]
};

export class UserPage {
  #parent: HTMLElement;
  #data: UserPageData;
  #id: string;
  #navbar: Navbar | null;
  #tabs: Tabs | null;
  #footer: Footer | null;
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
    this.#tabs = null;
    this.#footer = null;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    UserPageStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Обработка изменений состояния в AuthStore.
   * @param {AuthState} state - текущее состояние авторизации из Store
   */
  handleStoreChange(state: UserPageState) {
    if (state.needTabID) {
      this.#tabs?.activateTabById(state.needTabID);
      const element = document.querySelector('.favorites-section--movies');
      element?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

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

    this.#navbar?.destroy();
    this.#footer?.destroy();

    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
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

    this.#renderContent();

    this.#footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    this.#footer.render();
  }

  #renderContent() {
    const contentElement = this.#parent.querySelector('.content');
    this.#data.moviesCount = UserPageStore.getMoviesCount();
    this.#data.actorsCount = UserPageStore.getActorCount();
    this.#data.rating = UserPageStore.getAverageRating();

    if (contentElement) {
      contentElement.innerHTML = template(this.#data);
    }
    const buttonContainer = this.self()?.querySelector(`.user-page__action-button`);
    if (buttonContainer) {
      const changeUserLoginButtonConfig: ButtonConfig = {
        id: 'changeLoginBtn',
        color: 'primary',
        text: 'Изменить логин',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Измените логин',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              inputs: [
                {
                  id: 'loginInput',
                  name: 'login',
                  placeholder: 'Введите новый логин',
                  type: 'text',
                  text: UserPageStore.getState().userData?.username
                },
                {
                  id: 'passwordInput',
                  name: 'password',
                  placeholder: 'Введите старый пароль',
                  type: 'text'
                }
              ],
              onConfirm: () => {
                const username = modal.getInputByName('login').getValue();
                const password = modal.getInputByName('password').getValue();
                updateLogin({ username, password });
              }
            } as UniversalModalConfig);

            modal.render();
            modal.open();
          }
        }
      };

      const changeUserPasswordButtonConfig: ButtonConfig = {
        id: 'changePasswordBtn',
        color: 'primary',
        text: 'Изменить пароль',
        textColor: 'primary',
        actions: {
          click: async () => {
            const modal = new UniversalModal(document.body, {
              title: 'Измените пароль',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              inputs: [
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
                const username = UserPageStore.getState().userData?.username as string;
                const oldPassword = modal.getInputByName('oldPassword').getValue();
                const newPassword = modal.getInputByName('newPassword').getValue();
                const repeatedNewPassword = modal.getInputByName('repeatedNewPassword').getValue();
                updatePassword({ username, oldPassword, newPassword, repeatedNewPassword });
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
              title: 'Измените аватар (до 1МБ)',
              confirmText: 'Сохранить',
              cancelText: 'Отмена',
              inputs: [
                {
                  id: 'modalAvatarImageInput',
                  name: 'modalAvatarImage',
                  type: 'file',
                  accept: 'image/svg+xml,image/png,image/jpg,image/jpeg,image/webp'
                }
              ],
              onConfirm: () => {
                let selectedFile = null;
                const modalAvatarImageInput = document.getElementsByName('modalAvatarImage')[0] as HTMLInputElement;
                if (modalAvatarImageInput && modalAvatarImageInput.files) {
                  selectedFile = modalAvatarImageInput.files[0];
                }

                if (!selectedFile || !ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
                  // TODO error handle
                  PopupActions.showPopup({
                    message: 'Разрешены только изображения с разрешением SVG, PNG, JPG, JPEG или WEBP',
                    duration: 2500,
                    isError: true
                  });
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

      new Button(buttonContainer, changeUserLoginButtonConfig).render();
      new Button(buttonContainer, changeUserPasswordButtonConfig).render();
      new Button(buttonContainer, changeUserAvatarButtonConfig).render();
    }

    const tabsContainer = this.self()?.querySelector<HTMLElement>(`#${this.#id} .tabs-container`);
    if (tabsContainer && this.#data.tabsData) {
      this.#tabs = new Tabs(tabsContainer, this.data.tabsData);
      this.#tabs.render();
    }
  }

  update() {
    this.#renderContent();
  }
}
