import Navbar from 'components/navbar/navbar.js';
import Scroll from 'components/Scroll/Scroll';
import MovieCard, { CardConfig } from 'components/Card/Card';
import { createID } from 'utils/createID.ts';
import { BASE_URL } from '../../consts.js';
import { Footer } from 'components/Footer/Footer.ts';
import { FOOTER_CONFIG } from '../../consts.js';
import compilationTempl from './compilation.hbs';
import { dispatcher } from 'flux/Dispatcher';
import { GetDataActionTypes } from 'flux/ActionTypes';

import { Urls } from '../../modules/router.ts';
import { MainPageConfig, MovieCollection } from 'types/main_page.types.ts';
import { FooterData } from 'types/Footer.types.ts';
import { ErrorWithDetails } from 'utils/fetch.ts';

class MainPage {
  #parent: HTMLElement;
  #config: MainPageConfig;
  navbar: Navbar | null;

  constructor(parent: HTMLElement, config: MainPageConfig) {
    this.#parent = parent;

    this.#config = {
      id: config.id || 'main_page',
      headerId: createID(),
      contentId: createID(),
      footerId: createID()
    };

    this.navbar = null;
  }

  self() {
    if (!this.#parent) {
      return;
    }
    return document.getElementById(this.#config.id);
  }

  destroy() {
    if (!this.self()) {
      return;
    }
    this.self()?.remove();
    this.navbar?.destroy();
  }

  async GetCompilations() {
    try {
      const url = BASE_URL + 'collections/';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Ошибка при получении подборок: ${response.status}`);
      }

      const compilations = await response.json();
      return { data: compilations, error: null };
    } catch (error: unknown) {
      console.error('Failed to post new movie review data:', error);
      let errorMessage = null;
      if (error instanceof ErrorWithDetails) {
        errorMessage = error.errorDetails.error || error.message;
      } else {
        errorMessage = 'Не удалось отправить данные нового отзыва фильма';
      }
      return { data: null, error: errorMessage };
    }

    // catch (error) {
    //   console.error(error.message);
    //   return { data: null, error: error.message };
    // }
  }

  async render() {
    // this.destroy();

    this.#parent.innerHTML = '';

    const mainElem = document.createElement('main');
    mainElem.id = this.#config.id;
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = this.#config.headerId;
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader);
    this.navbar = nav;
    nav.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList += 'content';
    mainElemContent.id = this.#config.contentId;
    mainElem.appendChild(mainElemContent);

    const compilationsElem = document.createElement('compilations');
    compilationsElem.classList += 'flex-dir-col compilations';
    mainElemContent.appendChild(compilationsElem);

    const compilationsData = await this.GetCompilations();
    if (compilationsData.error) {
      dispatcher.dispatch({
        type: GetDataActionTypes.UNKNOWN_ERROR,
        payload: { error: compilationsData.error }
      });
      return;
    }

    for (const key in compilationsData.data) {
      const compData = compilationsData.data[key];

      const compilationElem = document.createElement('compilation');
      compilationElem.classList.add('compilation', 'flex-dir-col');

      compilationElem.insertAdjacentHTML(
        'beforeend',
        compilationTempl({
          title: key
        })
      );

      compilationsElem.insertAdjacentElement('beforeend', compilationElem);
      const scroll = new Scroll(compilationElem);
      scroll.render();
      scroll.self()?.classList.add('compilation__scroll');

      Object.values(compData as MovieCollection).forEach((movie) => {
        let movie_url = `${Urls.movie}/${movie.id}`;
        let newCardConfig: CardConfig = {};

        newCardConfig.id = String(movie.id);
        newCardConfig.previewUrl = movie.preview_url;
        newCardConfig.title = movie.title;
        newCardConfig.url = movie_url;

        const contentContainer = scroll.getContentContainer();

        if (!contentContainer) {
          return;
        }
        new MovieCard(contentContainer, newCardConfig).render();
      });
    }

    const footer = new Footer(mainElem, FOOTER_CONFIG as FooterData);
    footer.render();
  }
}

export default MainPage;
