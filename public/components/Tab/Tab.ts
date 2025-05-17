import { createID } from 'utils/createID';
import template from './Tab.hbs';
import { TabData, TabsData } from 'types/Tab.types';

export class Tabs {
  #parent: HTMLElement;
  #data: TabsData;
  #id: string;

  /**
   * Создает новый компонент табов.
   * @param parent Родительский элемент, куда будет вставлен компонент.
   * @param tabsData Массив объектов для табов.
   */
  constructor(parent: HTMLElement, tabsData: TabData[] = []) {
    this.#parent = parent;
    this.#id = 'tabs--' + createID();
    this.#data = { id: this.#id, tabsData };
  }

  /**
   * Возвращает родителя.
   * @returns HTMLElement
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Возвращает данные.
   * @returns TabsData
   */
  get data(): TabsData {
    return this.#data;
  }

  /**
   * Проверяет, есть ли родитель.
   * @returns boolean
   */
  parentDefined(): boolean {
    return !!this.#parent;
  }

  /**
   * Возвращает себя из DOM.
   * @returns HTMLElement | null
   */
  self(): HTMLElement | null {
    return this.parentDefined() ? document.getElementById(this.#id) : null;
  }

  /**
   * Удаляет отрисованный компонент из DOM.
   */
  destroy(): void {
    this.self()?.remove();
  }

  /**
   * Рисует табы на экране.
   */
  render(): void {
    this.destroy();
    if (!this.parentDefined()) {
      return;
    }

    this.#parent.innerHTML += template(this.#data);

    this.#initTabs();
  }

  /**
   * Инициализирует обработчики клика для переключения табов и управление активным классом.
   * При клике вызывается переданный из вне колбэк для реализации логики.
   */
  #initTabs(): void {
    const component = this.self();
    if (!component) {
      return;
    }

    const tabElements = component.querySelectorAll('.tabs__item');

    tabElements.forEach((tab: Element) => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        tabElements.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const tabData = this.#data.tabsData.find((item) => item.id === tabId);
        if (tabData && typeof tabData.onClick === 'function') {
          tabData.onClick(tabId!);
        }

        if (typeof this.#data.onTabChange === 'function') {
          this.#data.onTabChange(tabId!);
        }
      });
    });

    // // Активируем первую вкладку по умолчанию
    // if (tabElements.length > 0) {
    //   (tabElements[0] as HTMLElement).click();
    // }
  }

  /**
   * Активирует вкладку с указанным ID
   * @param tabId Идентификатор вкладки, которую нужно активировать
   * @returns true если вкладка была найдена и активирована, false в противном случае
   */
  activateTabById(tabId: string): void {
    if (!this.self()) {
      return;
    }
    const tabElement = this.self()?.querySelector(`.tabs__item[data-tab="${tabId}"]`) as HTMLElement;
    tabElement?.click();
  }
  /**
   * Активирует вкладку с указанным ID без вызова обработчика клика.
   * @param tabId Идентификатор вкладки, которую нужно активировать.
   * @returns true, если вкладка была найдена и активирована, false — в противном случае.
   */
  activateTabByIdDirect(tabId: string): void {
    const component = this.self();
    if (!component) {
      return;
    }
    const tabElements = component.querySelectorAll('.tabs__item');
    tabElements.forEach((el) => el.classList.remove('active'));
    const targetTab = component.querySelector(`.tabs__item[data-tab="${tabId}"]`) as HTMLElement;
    targetTab?.classList.add('active');
  }
}
