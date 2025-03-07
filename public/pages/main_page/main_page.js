import Navbar from '../../components/navbar/navbar.js';
import { createID } from '/utils/createID.js';
import { BASE_URL } from '/consts.js';

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
    // eslint-disable-next-line no-undef
    const compilationTempl = Handlebars.templates['compilation.hbs'];

    const compilationsData = await this.GetCompilations();
    if (compilationsData.err) {
      console.log('Ошибка: ', compilationsData.err);
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
  }
}

export default MainPage;
