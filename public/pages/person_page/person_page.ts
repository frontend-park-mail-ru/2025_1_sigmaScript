import { createID } from 'utils/createID';
import { PersonInfo, PersonState } from 'types/Person.types.ts';
import PersonPageStore from 'store/PersonPageStore.ts';
import { router, Urls } from '../../modules/router.ts';
import personTemplate from './person_page.hbs';
import noPersonTemplate from './no_person_page.hbs';

import Navbar from 'components/navbar/navbar.js';
import Button from 'components/universal_button/button.js';
import { addActorToFavorite, PopupActions, removeActorFromFavorite } from 'flux/Actions.ts';
import { Footer } from 'components/Footer/Footer.ts';
import { FOOTER_CONFIG } from 'public/consts';
import { FooterData } from 'types/Footer.types';
import Scroll from 'components/Scroll/Scroll.ts';
import MovieCard from 'components/Card/Card.ts';
import { MovieCollection } from 'types/main_page.types.ts';
import Card from 'components/Card/Card.ts';
import { MoviesMap } from 'types/UserPage.types.ts';
import UserPageStore from 'store/UserPageStore.ts';

// temp data
const actorInfo: PersonInfo = {
  personID: null,
  photoUrl: '/static/avatars/avatar_default_picture.svg',
  nameRu: null,
  nameEn: null,
  favorite: false,
  career: null,
  height: null,
  gender: null,
  dateOfBirth: null,
  genres: null,
  totalFilms: null,
  biography: null,
  dateOfDeath: null,
  movieCollection: []
};

export class PersonPage {
  private parent: HTMLElement;
  private id: string;
  private personData: PersonInfo | null;
  private navbar: Navbar | null;
  private favoriteButton: Button | null;
  private isFavorite: boolean;

  private bindedHandleStoreChange: (state: PersonState) => void;
  prevPage: () => void;
  private prevPageURL: string;

  /**
   * Создаёт новую форму входа/регистрации.
   * @param {HTMLElement} parent В какой элемент вставлять
   */
  constructor(parent: HTMLElement, prevPageURLPath: string, personData: PersonInfo | null = null) {
    this.parent = parent;

    this.id = 'person-page--' + createID();

    if (!personData) {
      this.personData = actorInfo;
    } else {
      this.personData = personData;
    }

    this.prevPageURL = prevPageURLPath;

    this.prevPage = () => {
      router.go(this.prevPageURL);
    };

    this.navbar = null;
    this.favoriteButton = null;
    this.isFavorite = false;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    PersonPageStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  getParent(): HTMLElement {
    return this.parent;
  }

  /**
   * Задаем родителя.
   */
  setParent(newParent: HTMLElement): void {
    this.parent = newParent;
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement}
   */
  self(): HTMLElement | null {
    return this.parent ? document.getElementById(this.id) : null;
  }

  /**
   * Удаляет отрисованные элементы.
   */
  destroy(): void {
    PersonPageStore.unsubscribe(this.bindedHandleStoreChange);
    this.navbar?.destroy();
    this.favoriteButton?.destroy();
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    if (!this.parent) {
      return;
    }
    this.parent.innerHTML = '';

    const mainElem = document.createElement('main');
    mainElem.id = createID();
    this.parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = createID();
    mainElem.appendChild(mainElemHeader);

    this.navbar = new Navbar(mainElemHeader);
    this.navbar.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList += 'content';
    mainElem.appendChild(mainElemContent);

    mainElemContent.innerHTML = personTemplate(this.personData);
    this.isFavorite = UserPageStore.isFavoriteActor(this.personData?.personID as number);

    new Card(document.querySelector('.person-page__photo-container')!, {
      id: `actorCard--${this.personData?.personID}`,
      previewUrl: this.personData?.photoUrl || '/static/img/default_preview.webp',
      width: '300',
      height: '460',
      hover: false,
      addClass: ['actor-card']
    }).render();

    this.favoriteButton = new Button(this.parent.querySelector('.favorite-button__container'), {
      id: 'button--favourite-' + createID(),
      color: this.isFavorite ? 'favorite' : 'primary',
      type: 'button',
      text: this.isFavorite ? 'Удалить' : 'Добавить',
      addClasses: ['actor__button'],
      srcIcon: '/static/svg/favourite.svg',
      actions: {
        click: () => {
          if (this.isFavorite) {
            removeActorFromFavorite(this.personData?.personID as number);
            this.favoriteButton?.setColor('primary');
            this.favoriteButton?.setText('Добавить');
            this.isFavorite = false;
          } else {
            addActorToFavorite({
              personID: this.personData?.personID as number,
              nameRu: this.personData?.nameRu as string,
              photoUrl: this.personData?.photoUrl as string
            });
            this.favoriteButton?.setColor('favorite');
            this.favoriteButton?.setText('Удалить');
            this.isFavorite = true;
          }
        }
      }
    });
    if (UserPageStore.getState().userData?.username) {
      this.favoriteButton.render();
    }

    const contentDiv = document.querySelector('.person-page__films') as HTMLElement;
    if (!contentDiv) return;
    contentDiv.innerHTML = '';

    const moviesSection = document.createElement('div');
    moviesSection.classList.add('favorites-section', 'favorites-section--movies');
    contentDiv.appendChild(moviesSection);

    const moviesTitle = document.createElement('h4');
    moviesTitle.textContent = 'Фильмы с участием актёра';
    moviesTitle.classList.add('favorites-section__title');
    moviesSection.appendChild(moviesTitle);

    const moviesScroll = new Scroll(moviesSection);
    moviesScroll.render();
    const moviesContainer = moviesScroll.getContentContainer();
    if (moviesContainer) {
      for (const [id, movie] of this.personData?.movieCollection as MoviesMap) {
        new MovieCard(moviesContainer, {
          id: `movieCard--${id}`,
          title: movie.title,
          url: `${Urls.movie}/${id}`,
          previewUrl: movie.preview_url || '/static/img/default_preview.webp',
          width: '130',
          height: '180',
          addClass: ['movie-card']
        }).render();
      }
    }

    new Footer(mainElem, FOOTER_CONFIG as FooterData).render();

    this.addEvents();
  }

  /**
   * Рисует компонент на экран.
   */
  renderEmpty(): void {
    if (!this.parent) {
      return;
    }
    this.parent.innerHTML = '';

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = createID();
    this.parent.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    nav.render();

    this.parent.insertAdjacentHTML('beforeend', noPersonTemplate(this.personData));

    this.addEvents();
  }

  /**
   * Обработка изменений состояния в Store.
   * @param {PersonInfo} state - текущее состояние из Store
   */
  handleStoreChange(state: PersonState) {
    if (UserPageStore.getState().userData?.username) {
      this.favoriteButton?.render();
    }
    if (state.error) {
      this.renderEmpty();
      return;
    }
    if (state.needUpdateFavorite) {
      this.isFavorite = UserPageStore.isFavoriteActor(this.personData?.personID as number);
      if (this.isFavorite) {
        this.favoriteButton?.setColor('favorite');
        this.favoriteButton?.setText('Удалить');
      } else {
        this.favoriteButton?.setColor('primary');
        this.favoriteButton?.setText('Добавить');
      }
      return;
    }
  }

  /**
   * Добавление событий.
   */
  addEvents(): void {
    return;
  }
}
