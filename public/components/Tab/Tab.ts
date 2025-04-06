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
   * Возвращает родительский элемент.
   * @returns HTMLElement
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Возвращает данные для шаблона.
   * @returns TabsData
   */
  get data(): TabsData {
    return this.#data;
  }

  /**
   * Проверяет родителя
   * @returns boolean
   */
  parentDefined(): boolean {
    return !!this.#parent;
  }

  /**
   * Возвращает DOM-элемент компонента.
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
   * Рисует компонент на экране.
   */
  render(): void {
    this.destroy();
    if (!this.parentDefined()) {
      return;
    }

    this.#parent.innerHTML += template(this.#data);
    // TODO: реализовать в будущем
    this.#initTabs();
  }

  /**
   * Инициализирует обработчики событий для переключения табов.
   * При клике скрываются все секции с контентом и показывается та,
   * чей id совпадает с data-атрибутом выбранного таба.
   */
  #initTabs(): void {
    const component = this.self();
    if (!component) return;

    const tabElements = component.querySelectorAll('.tabs__item');
    tabElements.forEach((tab: Element) => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach((content: Element) => {
          (content as HTMLElement).style.display = 'none';
        });
        const activeContent = document.getElementById(`tab-${tabId}`);
        if (activeContent) {
          activeContent.style.display = 'block';
        }
      });
    });
    if (tabElements.length > 0) {
      (tabElements[0] as HTMLElement).click();
    }
  }
}
