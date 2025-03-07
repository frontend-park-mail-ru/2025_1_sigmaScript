class MainPage {
  #parent;
  #config = {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || 'main_page';
  }

  self() {
    if (!this.#parent) {
      return;
    }
    return this.#parent.querySelector('#' + this.#config.id);
  }

  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }

  async GetCompilations() {
    try {
      // Делаем запрос на сервер
      const response = await fetch('http://localhost:8080/collections/');
      if (!response.ok) {
        throw new Error(`Ошибка при получении подборок: ${response.status}`);
      }

      const compilations = await response.json();
      console.log(compilations);

      return { data: compilations, error: null };
    } catch (error) {
      console.error(error.message);
      return { data: null, error: error.message };
    }
  }

  async render() {
    this.#parent.innerHTML = ''; // обнуляем root

    // Рендерим главную страницу
    const mainElem = document.createElement('main');
    mainElem.classList.add('flex-dir-row');
    mainElem.id = this.#config.id;
    this.#parent.appendChild(mainElem);

    const compilationsData = await this.GetCompilations();

    if (compilationsData.err) {
      console.log('Ошибка: ', compilationsData.err);
      return;
    }

    // Рендерим главную страницу
    const compilationsElem = document.createElement('compilations');
    compilationsElem.classList.add('flex-dir-row');

    mainElem.appendChild(compilationsElem);

    // eslint-disable-next-line no-undef
    const compilationTempl = Handlebars.templates['compilation.hbs'];
    // Рендерим каждую подборку
    for (const key in compilationsData.data) {
      const compData = compilationsData.data[key];
      console.log(key);

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
