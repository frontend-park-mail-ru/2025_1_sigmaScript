import Navbar from 'components/navbar/navbar.js';
import Scroll from 'components/Scroll/Scroll';
import MovieCard, { CardConfig } from 'components/Card/Card';
import { createID } from 'utils/createID.ts';
import { Footer } from 'components/Footer/Footer.ts';
import { FOOTER_CONFIG } from '../../consts.js';
import compilationTempl from './compilation.hbs';
import { Urls } from '../../modules/router.ts';
import { Collections, MainPageConfig, MovieCollection } from 'types/main_page.types.ts';
import { FooterData } from 'types/Footer.types.ts';
import { AuthState } from 'types/Auth.types.ts';
import MainPageStore from 'store/MainPageStore.ts';
import Loading from 'components/Loading/loading.ts';
import MovieCarousel from 'components/MovieCarousel/MovieCarousel.ts';

type MainPageStateFromStore = {
  auth: AuthState;
  mainData: Collections | null;
  isLoading: boolean;
  error: string | null;
};

class MainPage {
  #parent: HTMLElement;
  #config: MainPageConfig;
  #state: MainPageStateFromStore = {
    auth: {
      user: null,
      error: null
    },
    mainData: null,
    isLoading: false,
    error: null
  };
  private bindedHandleStoreChange: (state: MainPageStateFromStore) => void;

  constructor(parent: HTMLElement, config: MainPageConfig) {
    this.#parent = parent;
    this.#config = {
      id: config.id || 'main_page',
      headerId: createID(),
      contentId: createID(),
      footerId: createID()
    };
    this.#state = MainPageStore.getState();
    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    MainPageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: MainPageStateFromStore): void {
    this.#state = newState;
    this.update();
  }

  self() {
    if (!this.#parent) {
      return;
    }
    return document.getElementById(this.#config.id);
  }

  destroy(): void {
    MainPageStore.unsubscribe(this.bindedHandleStoreChange);
    this.self()?.remove();
  }

  private createCompilationElement(parent: HTMLElement, title: string): HTMLElement {
    const compilationElem = document.createElement('compilation');
    compilationElem.classList.add('compilation', 'flex-dir-col');
    compilationElem.insertAdjacentHTML('beforeend', compilationTempl({ title }));
    parent.insertAdjacentElement('beforeend', compilationElem);
    return compilationElem;
  }

  private renderMovieCards(scroll: Scroll, movies: MovieCollection, config?: CardConfig): void {
    const contentContainer = scroll.getContentContainer();
    if (!contentContainer) return;
    Object.values(movies).forEach((movie) => {
      const movieUrl = `${Urls.movie}/${movie.id}`;
      const cardConfig: CardConfig = {
        id: String(movie.id),
        previewUrl: movie.previewUrl,
        title: movie.title,
        url: movieUrl,
        width: config?.width,
        height: config?.height,
        topText: movie.rating?.toFixed(1),
        bottomText: config?.bottomText || ''
      };
      new MovieCard(contentContainer, cardConfig).render();
    });
  }

  private toCalendarDate(dateStr: string | undefined): string {
    if (!dateStr) return '';

    const months = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
    const date = new Date(dateStr);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const formattedDay = String(day).padStart(2, '0');
    const monthAbbr = months[monthIndex];
    return `${formattedDay} | ${monthAbbr}`;
  }

  private renderCalendarCards(scroll: Scroll, movies: MovieCollection): void {
    const contentContainer = scroll.getContentContainer();
    if (!contentContainer) return;

    Object.values(movies).forEach((movie) => {
      const movieUrl = `${Urls.movie}/${movie.id}`;
      const cardConfig: CardConfig = {
        id: createID(),
        previewUrl: movie.previewUrl,
        title: movie.title,
        url: movieUrl,
        topText: 'Скоро',
        bottomText: this.toCalendarDate(movie.releaseDate)
      };
      new MovieCard(contentContainer, cardConfig).render();
    });
  }

  private handleCompilations(
    compilationsElem: HTMLElement,
    promoElem: HTMLElement,
    compilationsData: Record<string, MovieCollection>
  ): void {
    for (const key in compilationsData) {
      if (key === 'calendar') {
        const compData = compilationsData[key];
        const compilationElem = this.createCompilationElement(compilationsElem, 'Календарь премьер');
        const scroll = new Scroll(compilationElem);
        scroll.render();
        scroll.self()?.classList.add('compilation__scroll', 'calendar');
        this.renderCalendarCards(scroll, compData);
        continue;
      }

      if (key === 'promo') {
        const promoData = compilationsData[key];

        const carousel = new MovieCarousel(promoElem, { movies: promoData, interval: 12000 });
        carousel.render();
        continue;
      }

      const compData = compilationsData[key];
      const compilationElem = this.createCompilationElement(compilationsElem, key);
      const scroll = new Scroll(compilationElem);
      scroll.render();
      scroll.self()?.classList.add('compilation__scroll');
      this.renderMovieCards(scroll, compData);
    }
  }

  async render() {
    this.#parent.innerHTML = '';

    const mainElem = document.createElement('main');
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList.add('header', 'sticky_to_top');
    mainElemHeader.id = this.#config.headerId;
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    nav.render();
    nav.self()?.classList.add('navbar--overlay');
    this.setupNavbarScrollEffect();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList.add('content', 'main-page');
    mainElemContent.id = this.#config.id;
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
      container.classList.add('loading-state');
      new Loading(container).render();
      return;
    } else {
      container.classList.remove('loading-state');
    }
    if (this.#state.error) {
      container.innerHTML = `<div style="width: 100%;" class="flex-dir-row flex-center"><div class="error">Ошибка: ${this.#state.error}</div></div>`;
      return;
    }

    if (this.#state.mainData) {
      const promoElem = document.createElement('promo');
      promoElem.classList.add('flex-dir-col', 'promo');
      container.appendChild(promoElem);
      const compilationsElem = document.createElement('compilations');
      compilationsElem.classList.add('flex-dir-col', 'compilations');
      container.appendChild(compilationsElem);
      this.handleCompilations(compilationsElem, promoElem, this.#state.mainData);
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }

  setupNavbarScrollEffect = () => {
    const navbar = document.querySelector<HTMLElement>('.navbar');
    if (!navbar) {
      return;
    }

    const scrollThreshold = 350;
    const scrolledClass = 'navbar--scrolled';

    const checkScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > scrollThreshold) {
        navbar.classList.add(scrolledClass);
      } else {
        navbar.classList.remove(scrolledClass);
      }
    };

    let isStopped = false;
    const throttledCheckScroll = () => {
      if (!isStopped) {
        checkScroll();
        isStopped = true;
        setTimeout(() => {
          isStopped = false;
        }, 50);
      }
    };
    checkScroll();
    window.addEventListener('scroll', throttledCheckScroll);

    // TODO
    // return () => {
    //   window.removeEventListener('scroll', throttledCheckScroll);
    // };
  };
}
export default MainPage;
