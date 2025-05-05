import { createID } from 'utils/createID';
import MovieCard, { CardConfig } from 'components/Card/Card';
import Loading from 'components/Loading/loading';
import Navbar from 'components/navbar/navbar';
import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from '../../consts.js';
import { Urls } from '../../modules/router';
import { FooterData } from 'types/Footer.types.js';
import GenrePageStore, { GenrePageState } from 'store/GenrePageStore';

class GenrePage {
  #parent: HTMLElement;
  #id: string;
  #state: GenrePageState = {
    genreId: null,
    genreData: null,
    isLoading: true,
    error: null
  };
  private bindedHandleStoreChange: (state: GenrePageState) => void;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'moviePage--' + createID();
    this.#state = GenrePageStore.getState();

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    GenrePageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: GenrePageState): void {
    this.#state = newState;
    this.update();
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#id);
  }

  destroy(): void {
    GenrePageStore.unsubscribe(this.bindedHandleStoreChange);
    this.self()?.remove();
  }

  render(): void {
    this.#parent.innerHTML = '';
    const mainElem = document.createElement('main');
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    nav.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList.add('genre-page', 'flex-dir-col', 'content');
    mainElemContent.id = this.#id;
    mainElem.appendChild(mainElemContent);

    const footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    footer.render();

    this.update();
  }

  update(): void {
    const container = this.self();
    if (!container) return;
    container.innerHTML = '';

    if (this.#state.isLoading) {
      new Loading(container).render();
      return;
    }

    if (this.#state.error) {
      container.innerHTML = `<div style="width: 100%;" class="flex-dir-row flex-center"><div class="error">Ошибка: ${this.#state.error}</div></div>`;
      return;
    }

    if (this.#state.genreData) {
      const { name, movies } = this.#state.genreData;
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const compilationElem = document.createElement('div');
      compilationElem.className = 'genre-page__compilation flex-dir-col';
      const titleElem = document.createElement('div');
      titleElem.classList.add('genre-page__compilation-title', 'flex-dir-row');
      titleElem.textContent = capitalizedName;
      compilationElem.appendChild(titleElem);

      const grid = document.createElement('div');
      grid.className = 'genre-movie-grid';
      movies.forEach((movie) => {
        const cardConfig: CardConfig = {
          id: createID(),
          previewUrl: movie.previewUrl,
          title: movie.title,
          url: `${Urls.movie}/${movie.id}`,
          topText: movie.rating.toFixed(1),
          bottomText: ''
        };
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'genre-movie-grid__item';
        new MovieCard(cardWrapper, cardConfig).render();
        grid.appendChild(cardWrapper);
      });
      compilationElem.appendChild(grid);

      container.appendChild(compilationElem);
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }
}

export default GenrePage;
