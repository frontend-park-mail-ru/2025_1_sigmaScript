import { createID } from 'utils/createID';
import MovieCard, { CardConfig } from 'components/Card/Card';
import Scroll from 'components/Scroll/Scroll';
import GenresPageStore, { GenresData, GenresPageState, Genre } from 'store/GenresPageStore';
import Loading from 'components/Loading/loading';
import Navbar from 'components/navbar/navbar';
import compilationTempl from './compilation.hbs';
import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from '../../consts.js';
import { router, Urls } from '../../modules/router';
import { FooterData } from 'types/Footer.types.js';
import { MovieCollection } from 'types/main_page.types.js';

class GenresPage {
  #parent: HTMLElement;
  #id: string;
  #state: GenresPageState = {
    genresData: null,
    isLoading: true,
    error: null
  };
  private bindedHandleStoreChange: (state: GenresPageState) => void;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'moviePage--' + createID();
    this.#state = GenresPageStore.getState();

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    GenresPageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: GenresPageState): void {
    this.#state = newState;
    this.update();
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#id);
  }

  destroy(): void {
    GenresPageStore.unsubscribe(this.bindedHandleStoreChange);
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
    mainElemContent.classList.add('genres-page', 'flex-dir-col', 'flex-start', 'content');
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

    if (this.#state.genresData) {
      const data = this.#state.genresData;

      const compilationsElem = document.createElement('div');
      compilationsElem.className = 'genres-page__compilations flex-dir-col js-genres-compilations';
      container.appendChild(compilationsElem);

      this.handleCompilations(data);
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }

  private renderMovieCards(scroll: Scroll, movies: MovieCollection, config?: CardConfig): void {
    const contentContainer = scroll.getContentContainer();
    if (!contentContainer) return;
    movies.forEach((movie) => {
      const movieUrl = `${Urls.movie}/${movie.id}`;
      const cardConfig: CardConfig = {
        id: createID(),
        previewUrl: movie.previewUrl,
        title: movie.title,
        url: movieUrl,
        width: config?.width,
        height: config?.height,
        topText: movie.rating?.toFixed(1),
        bottomText: config?.bottomText || '',
        rating: movie.rating // Передаем рейтинг для цветового кодирования
      };
      new MovieCard(contentContainer, cardConfig).render();
    });
  }

  private createCompilationElement(parent: HTMLElement, genre: { id: number; name: string }): HTMLElement {
    const genreUrl = `${Urls.genres}/${genre.id}`;
    const compilationElem = document.createElement('div');
    compilationElem.classList.add('genres-page__compilation', 'flex-dir-col');
    compilationElem.insertAdjacentHTML('beforeend', compilationTempl({ title: genre.name, url: genreUrl }));
    parent.insertAdjacentElement('beforeend', compilationElem);
    return compilationElem;
  }

  private handleCompilations(genresData: GenresData): void {
    const compilationsElem = this.self()?.querySelector<HTMLElement>('.js-genres-compilations');
    if (!compilationsElem) return;
    for (const genre of genresData) {
      if (!genre.movies) {
        continue;
      }

      const compilationElem = this.createCompilationElement(compilationsElem, this.capitalizeGenre(genre));
      const scroll = new Scroll(compilationElem);
      scroll.render();
      scroll.self()?.classList.add('genres-page__compilation-scroll');
      this.renderMovieCards(scroll, genre.movies);
      const link = compilationElem.querySelector('.genres-page__compilation-all');
      if (link) {
        link.addEventListener('click', this.clickHandler);
      }
    }
  }

  private clickHandler(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;
    if (target && target.dataset.url) {
      const url = target.dataset.url;
      router.go(url);
    }
  }

  capitalizeGenre = (genre: Genre): Genre => {
    if (!genre.name) return genre;
    return {
      ...genre,
      name: genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
    };
  };
}

export default GenresPage;
