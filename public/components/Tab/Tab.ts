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
    // Если универсальный колбэк не передан, то он останется undefined
    this.#data = { id: this.#id, tabsData };
  }

  /**
   * Геттер для родительского элемента.
   * @returns HTMLElement
   */
  get parent(): HTMLElement {
    return this.#parent;
  }

  /**
   * Геттер для данных.
   * @returns TabsData
   */
  get data(): TabsData {
    return this.#data;
  }

  /**
   * Проверяет, определён ли родительский элемент.
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
    // Если компонент существует, удаляем его
    if (!this.self()) {
      return;
    }
    // Найдем все табы внутри компонента
    const tabElements = this.self()?.querySelectorAll('.tabs__item');
    // Удаляем обработчики события (заметим, что removeEventListener здесь не сработает для анонимной функции,
    // поэтому может быть достаточно полного удаления DOM-элемента)
    tabElements?.forEach((tab: Element) => {
      tab.removeEventListener('click', () => {
        // удаление обработчика в данном случае не приведет к ожидаемому результату
      });
    });
    this.self()?.remove();
  }

  /**
   * Рисует компонент табов на экране.
   */
  render(): void {
    this.destroy();
    if (!this.parentDefined()) {
      return;
    }
    // Вставляем сгенерированную разметку в родительский элемент
    this.#parent.innerHTML += template(this.#data);
    // Инициализируем обработчики событий для табов
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
        console.log('on click action');
        const tabId = tab.getAttribute('data-tab');
        // Снимаем активное состояние со всех табов
        tabElements.forEach((el) => el.classList.remove('active'));
        // Добавляем активное состояние для выбранного таба
        tab.classList.add('active');

        // Если у конкретного таба определён свой колбэк onClick, вызываем его
        const tabData = this.#data.tabsData.find((item) => item.id === tabId);
        console.log(tabData, tabData?.onClick);
        if (tabData && typeof tabData.onClick === 'function') {
          tabData.onClick(tabId!);
        }
        // Если задан универсальный колбэк для переключения табов, вызываем его
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
}
