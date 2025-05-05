import { createID } from 'utils/createID';
import template from './SearchPage.hbs';
import { SearchPageState } from 'types/SearchPage.types';
import SearchPageStore from 'store/SearchPageStore';
import Navbar from 'components/navbar/navbar';
import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from 'public/consts';
import { FooterData } from 'types/Footer.types';
import Input from 'components/universal_input/input';
import { debounce } from 'utils/debounce';
import Scroll from 'components/Scroll/Scroll';
import MovieCard from 'components/Card/Card';
import { Urls } from 'modules/router';
import { search } from 'flux/Actions';
import { ActorsMap, MoviesMap } from 'types/UserPage.types';

export class SearchPage {
  #parent: HTMLElement;
  #id: string;
  #navbar: Navbar | null;
  #input: Input | null;
  #footer: Footer | null;
  private bindedHandleStoreChange: (state: SearchPageState) => void;

  /**
   * Создает новую страницу пользователя.
   * @param {HTMLElement} parent Родительский элемент, куда будет вставлена страница.
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'userPage--' + createID();
    this.#navbar = null;
    this.#input = null;
    this.#footer = null;

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    SearchPageStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Обработка изменений состояния в AuthStore.
   * @param {AuthState} state - текущее состояние авторизации из Store
   */
  handleStoreChange(state: SearchPageState) {
    this.#renderMovies(state.movieCollection!);
    this.#renderActors(state.actorCollection!);
  }

  /**
   * Возвращает родителя.
   * @returns {HTMLElement}
   */
  get parent(): HTMLElement {
    return this.#parent;
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
    SearchPageStore.unsubscribe(this.bindedHandleStoreChange);

    this.#navbar?.destroy();
    this.#input?.destroy();
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
    this.#addEvents();

    this.#footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    this.#footer.render();
  }

  #renderContent(): void {
    const contentElement = this.#parent.querySelector('.content');

    if (contentElement) {
      contentElement.innerHTML = template();
    }

    const inputContainer = this.self()?.querySelector(`.search-page__input`);
    this.#input = new Input(inputContainer, {
      id: 'searchInput' + createID(),
      name: 'search',
      type: 'text',
      placeholder: 'Поиск...'
    });
    this.#input.render();
  }

  #addEvents(): void {
    const debouncedSearch = debounce(this.#search.bind(this), 300);
    this.#input?.getInput().addEventListener('input', () => debouncedSearch());
  }

  #search(): void {
    search(this.#input?.getValue() as string);
  }

  #renderMovies(movieCollection: MoviesMap): void {
    const moviesSection = this.#parent.querySelector('.search-page__movies') as HTMLElement;
    moviesSection.innerHTML = '';

    const moviesTitle = document.createElement('h4');
    moviesTitle.textContent = 'Фильмы';
    moviesTitle.classList.add('favorites-section__title');
    moviesSection.appendChild(moviesTitle);

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

  #renderActors(actorCollection: ActorsMap): void {
    const actorsSection = this.#parent.querySelector('.search-page__actors') as HTMLElement;
    actorsSection.innerHTML = '';

    const actorsTitle = document.createElement('h4');
    actorsTitle.textContent = 'Актёры';
    actorsTitle.classList.add('favorites-section__title');
    actorsSection.appendChild(actorsTitle);

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
