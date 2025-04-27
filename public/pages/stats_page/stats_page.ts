import { createID } from 'utils/createID';
import template from './stats_page.hbs';
import { CSATStatisticDataJSON } from 'types/stats_page.types';
import StatsPageStore from 'store/StatsPageStore';
import Loading from 'components/Loading/loading';
import Navbar from 'components/navbar/navbar';
import { Footer } from 'components/Footer/Footer';
import { FOOTER_CONFIG } from '../../consts.js';
import { FooterData } from 'types/Footer.types.js';
import { router, Urls } from '../../modules/router';

type StatsPageStateFromStore = {
  data: CSATStatisticDataJSON | null;
  isLoading: boolean;
  error: string | null;
};

class StatsPage {
  #parent: HTMLElement;
  #id: string;
  #state: StatsPageStateFromStore = {
    data: null,
    isLoading: true,
    error: null
  };
  private bindedHandleStoreChange: (state: StatsPageStateFromStore) => void;

  constructor(parent: HTMLElement) {
    this.#parent = parent;
    this.#id = 'statsPage--' + createID();
    this.#state = StatsPageStore.getState();

    this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    StatsPageStore.subscribe(this.bindedHandleStoreChange);
  }

  handleStoreChange(newState: StatsPageStateFromStore): void {
    this.#state = newState;
    this.update();
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#id);
  }

  destroy(): void {
    StatsPageStore.unsubscribe(this.bindedHandleStoreChange);
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
    mainElemContent.classList.add('stats-page', 'flex-dir-col', 'flex-start', 'content');
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
      if (this.#state.error === 'unauthorized' || this.#state.error === 'unauthorized') {
        router.go(Urls.auth);
      }
      container.innerHTML = `<div style="width: 100%;" class="flex-dir-row flex-center"><div class="error">Ошибка: ${this.#state.error}</div></div>`;
      return;
    }

    if (this.#state.data) {
      const data = this.#state.data;
      container.innerHTML = template(data);
    } else {
      container.innerHTML = '<div class="info">Нет данных для отображения.</div>';
    }
  }
}

export default StatsPage;
