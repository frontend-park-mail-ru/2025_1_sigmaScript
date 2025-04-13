import { createID } from 'utils/createID';
import { PersonInfo, PersonState } from 'types/Person.types.ts';
import PersonPageStore from 'store/PersonPageStore.ts';
import { router } from '../../modules/router.ts';
import personTemplate from './person_page.hbs';
import noPersonTemplate from './no_person_page.hbs';

import Navbar from 'components/navbar/navbar.js';

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
  dateOfDeath: null
};

export class PersonPage {
  private parent: HTMLElement;
  private id: string;
  private personData: PersonInfo | null;

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

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = createID();
    this.parent.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    nav.render();

    this.parent.insertAdjacentHTML('beforeend', personTemplate(this.personData));

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
    if (state.person && state.person.favorite) {
      // TODO favorite actor
      return;
    }
    if (state.error) {
      this.renderEmpty();
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
