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

  // header(mainElem) {
  //   if (!mainElem) {
  //     return;
  //   }
  //   return mainElem.querySelector('#' + this.#config.headerId);
  // }

  // content(mainElem) {
  //   if (!mainElem) {
  //     return;
  //   }
  //   return mainElem.querySelector('#' + this.#config.contentId);
  // }

  // footer(mainElem) {
  //   if (!mainElem) {
  //     return;
  //   }
  //   return mainElem.querySelector('#' + this.#config.footerId);
  // }

  async GetCompilations() {
    try {
      // Делаем запрос на сервер
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

      // // Делаем запрос на сервер
      // const response = await fetch('http://localhost:8080/collections/');
      // if (!response.ok) {
      //   throw new Error(`Ошибка при получении подборок: ${response.status}`);
      // }

      const compilations = await response.json();
      return { data: compilations, error: null };
    } catch (error) {
      console.error(error.message);
      return { data: null, error: error.message };
    }
  }

  async render() {
    this.destroy();

    // Рендерим главную страницу
    const mainElem = document.createElement('main');
    mainElem.id = this.#config.id;
    this.#parent.appendChild(mainElem);

    // рендерим header
    const mainElemHeader = document.createElement('div');
    mainElemHeader.classList += 'header sticky_to_top';
    mainElemHeader.id = this.#config.headerId;
    mainElem.appendChild(mainElemHeader);

    // временное решение, пока нет state или роутера
    // рендерим navbar
    const nav = new Navbar(mainElemHeader, () => {
      const rootElement = document.getElementById('root');
      rootElement.innerHTML = '';
      const main = new MainPage(rootElement, { id: `${createID()}` });
      main.render();
    });
    nav.render();

    // Рендерим блок с контентом главной страницы
    const mainElemContent = document.createElement('div');
    mainElemContent.classList += 'content';
    mainElemContent.id = this.#config.contentId;
    mainElem.appendChild(mainElemContent);

    // создаем блок с подборками
    const compilationsElem = document.createElement('compilations');
    compilationsElem.classList += 'flex-dir-col compilations';
    mainElemContent.appendChild(compilationsElem);
    // eslint-disable-next-line no-undef
    const compilationTempl = Handlebars.templates['compilation.hbs'];

    // Получаем данные с бекенда
    const compilationsData = await this.GetCompilations();
    if (compilationsData.err) {
      console.log('Ошибка: ', compilationsData.err);
      return;
    }

    // Рендерим каждую подборку
    for (const key in compilationsData.data) {
      const compData = compilationsData.data[key];
      // Рендерим compilation
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
