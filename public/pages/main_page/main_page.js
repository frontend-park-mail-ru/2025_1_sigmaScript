import Navbar from 'components/navbar/navbar.js';
import { createID } from 'utils/createID.ts';
import { BASE_URL } from 'public/consts.js';
import { Footer } from 'components/Footer/Footer.ts';
import { FOOTER_CONFIG } from 'public/consts.js';
import compilationTempl from './compilation.hbs';
import { dispatcher } from 'flux/Dispatcher';
import { GetDataActionTypes } from 'flux/ActionTypes';

class MainPage {
  #parent;
  #config = {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || 'main_page';

    this.#config.headerId = createID();
    this.#config.contentId = createID();
    this.#config.footerId = createID();
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
    this.self().remove();
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
    } catch (error) {
      console.error(error.message);
      return { data: null, error: error.message };
    }
  }

  async render() {
    this.destroy();

    this.#parent.innerHTML = '';

    const mainElem = document.createElement('main');
    mainElem.id = this.#config.id;
    this.#parent.appendChild(mainElem);

    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = this.#config.headerId;
    mainElem.appendChild(mainElemHeader);

    const nav = new Navbar(mainElemHeader, () => {
      const rootElement = document.getElementById('root');
      rootElement.innerHTML = '';
      const main = new MainPage(rootElement, { id: `${createID()}` });
      main.render();
    });
    nav.render();

    const mainElemContent = document.createElement('div');
    mainElemContent.classList += 'content';
    mainElemContent.id = this.#config.contentId;
    mainElem.appendChild(mainElemContent);

    const compilationsElem = document.createElement('compilations');
    compilationsElem.classList += 'flex-dir-col compilations';
    mainElemContent.appendChild(compilationsElem);

    const compilationsData = await this.GetCompilations();
    if (compilationsData.err) {
      dispatcher.dispatch({
        type: GetDataActionTypes.UNKNOWN_ERROR,
        payload: { error: compilationsData.error }
      });
      return;
    }

    for (const key in compilationsData.data) {
      const compData = compilationsData.data[key];

      const compilationElem = document.createElement('compilation');
      compilationElem.classList.add('compilation');
      compilationElem.insertAdjacentHTML(
        'beforeEnd',
        compilationTempl({
          title: key,
          movies: Object.values(compData)
        })
      );

      compilationsElem.insertAdjacentElement('beforeEnd', compilationElem);
    }

    const footer = new Footer(mainElem, FOOTER_CONFIG);
    footer.render();
  }
}

export default MainPage;
