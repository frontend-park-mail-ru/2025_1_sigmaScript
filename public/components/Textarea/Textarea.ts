import { createID } from 'utils/createID';
import template from './Textarea.hbs';

type TextareaConfig = {
  id?: string;
  text?: string;
  name?: string;
  placeholder?: string;
  addClasses?: string[];
};

type InternalTextareaConfig = {
  id: string;
  text: string;
  name: string;
  placeholder: string;
};

class Textarea {
  #parent: HTMLElement | null;
  #config: InternalTextareaConfig;
  #addClasses: string[];

  /**
   * Элемент поля ввода
   * @param {HTMLElement} parent - родительский элемент
   * @param {Object} config - конфигурация
   * @param {string} config.id - уникальный id элемента
   * @param {string} config.text - текст по умолчанию
   * @param {string} config.name - имя элемента
   * @param {string} config.placeholder - placeholder в поле ввода
   * @param {string[]} config.addClasses - дополнительные классы элемента
   * @returns {Textarea}
   * @example
   * new Textarea(parent, {
   *  id: "search",
   *  placeholder: "введите имя",
   * }).render();
   */
  constructor(parent: HTMLElement | null, config: TextareaConfig) {
    this.#parent = parent;
    this.#config = {
      id: config.id || createID(),
      name: config.name || 'noname_textarea',
      text: config.text || '',
      placeholder: config.placeholder || ''
    };
    this.#addClasses = config.addClasses || [];
  }

  /**
   * Возвращает себя из DOM.
   * @returns {HTMLElement | null}
   */
  self(): HTMLElement | null {
    if (!this.#parent) {
      return null;
    }
    return this.#parent.querySelector<HTMLElement>(`#${this.#config.id}`);
  }

  /**
   * Задаем нового родителя.
   * @param {HTMLElement} newParent
   */
  setParent(newParent: HTMLElement): void {
    this.#parent = newParent;
  }

  /**
   * Добавляет заданные классы к корневому элементу.
   */
  #applyClasses(): void {
    const self = this.self();
    if (self && this.#addClasses.length > 0) {
      self.classList.add(...this.#addClasses);
    }
  }

  /**
   * Возвращает элемент контейнера для ошибок
   * @returns {Element | null}
   */
  getErrorContainer(): Element | null | undefined {
    return this.self()?.querySelector('.textarea__error-container');
  }

  /**
   * Возвращает элемент поле ввода
   * @returns {HTMLTextAreaElement | null}
   */
  getTextarea(): HTMLTextAreaElement | null | undefined {
    return this.self()?.querySelector<HTMLTextAreaElement>('.textarea__field');
  }

  /**
   * Очищает поле ввода
   */
  clearTextarea(): void {
    const textareaElement = this.getTextarea();
    if (textareaElement) {
      textareaElement.value = '';
    }
  }

  /**
   * Возвращает значение из поля ввода
   * @returns {string | undefined}
   */
  getValue(): string | undefined {
    return this.getTextarea()?.value;
  }

  /**
   * Удаляет отрисованный компонент.
   */
  destroy(): void {
    this.self()?.remove();
  }

  /**
   * Рисует компонент на экран.
   */
  render(): void {
    if (!this.#parent) {
      return;
    }
    if (this.self()) {
      this.destroy();
    }
    this.#parent.insertAdjacentHTML('beforeend', template(this.#config));
    this.#applyClasses();
  }
}

export default Textarea;
