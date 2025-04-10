import { createID } from 'utils/createID';
import { PersonState } from 'types/Person.types.ts';
import PersonPageStore from 'store/PersonPageStore.ts';
import { router } from '../../modules/router.ts';
import personTemplate from './person_page.hbs';

import Navbar from 'components/navbar/navbar.js';

// temp data
const actorInfo: PersonState = {
  photoUrl: 'https://i.pinimg.com/originals/a3/70/0b/a3700bdf15fcceabf740e1f347dbb5a2.jpg',
  nameRu: 'Киану Ривз',
  nameEn: 'Keanu Reeves',
  favorite: false, // Initial state
  career: 'Актёр, Продюсер, Режиссёр',
  height: '1.86', // Or "1.86"
  gender: 'Мужской',
  dateOfBirth: '2 сентября 1964',
  genres: 'Боевик, Фантастика, Триллер',
  totalFilms: 'Более 100', // As requested "строка"
  biography: `
    Киану Чарльз Ривз — канадский актёр, кинорежиссёр, кинопродюсер и музыкант.
    Наиболее известен своими ролями в киносериях «Матрица», «Билл и Тед», «Джон Уик», а также в фильмах «На гребне волны», «Скорость», «Адвокат дьявола», «Константин: Повелитель тьмы».
    Обладатель звезды на Голливудской «Аллее славы».
  ` // Example biography with HTML
};

export class PersonPage {
  private parent: HTMLElement;
  private id: string;
  private personData: PersonState | null;

  private bindedHandleStoreChange: (state: PersonState) => void;
  prevPage: () => void;
  private prevPageURL: string;

  /**
   * Создаёт новую форму входа/регистрации.
   * @param {HTMLElement} parent В какой элемент вставлять
   */
  constructor(parent: HTMLElement, prevPageURLPath: string, personData: PersonState | null = null) {
    this.parent = parent;

    this.id = 'person-page--' + createID();

    this.personData = personData;
    if (personData === null) {
      this.personData = actorInfo;
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

    const nav = new Navbar(mainElemHeader, () => {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        return;
      }
      rootElement.innerHTML = '';
      const main = new PersonPage(rootElement, router.getCurrentPath());
      main.render();
    });
    nav.render();

    this.parent.insertAdjacentHTML('beforeend', personTemplate(this.personData));

    this.addEvents();
  }

  /**
   * Обработка изменений состояния в Store.
   * @param {PersonState} state - текущее состояние из Store
   */
  handleStoreChange(state: PersonState) {
    if (state.favorite) {
      // TODO favorite actor
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
