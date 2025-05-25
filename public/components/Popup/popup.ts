import template from './popup.hbs';
import PopupStore from 'store/PopupStore';
import { PopupActions } from 'flux/Actions';

import type { PopupState } from 'types/Popup.types';

export class Popup {
  #parent: HTMLElement;
  #bindedHandleStoreChange: (state: PopupState) => void;

  /**
   * @param parent — контейнер для вставки попапа
   */
  constructor(parent?: HTMLElement) {
    this.#parent = parent ?? document.body;
    this.#bindedHandleStoreChange = this.handleStoreChange.bind(this);
    PopupStore.subscribe(this.#bindedHandleStoreChange);
  }

  handleStoreChange(state: PopupState): void {
    const existing = this.#parent.querySelector<HTMLElement>('.popup');

    // если нужно скрыть
    if (!state.current && existing) {
      existing.classList.remove('popup--visible');
      existing.classList.add('popup--hide');
      existing.addEventListener(
        'transitionend',
        () => {
          existing.remove();
        },
        { once: true }
      );
      return;
    }

    // если есть активный попап, при этом нужно отрисовать ещё один
    if (state.current && existing) {
      existing.remove();
    }

    if (!state.current) {
      return;
    }

    this.render(state.current);
  }

  /**
   * Отвечает за отрисовку попапа.
   *
   * @param popupData — данные для отображения попапа
   */
  render(popupData: PopupState['current']): void {
    if (!popupData) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = template(popupData).trim();
    const popup = wrapper.firstElementChild as HTMLElement;

    // обработчик для обычного попапа
    const close = popup.querySelector<HTMLElement>('.popup__close');
    if (close) {
      close.addEventListener('click', () => {
        PopupActions.hidePopup();
      });
    }

    // обработчик для уведомления о фильме
    const notificationClose = popup.querySelector<HTMLElement>('.popup__notification-close');
    if (notificationClose) {
      notificationClose.addEventListener('click', () => {
        PopupActions.hidePopup();
      });
    }

    this.#parent.appendChild(popup);

    requestAnimationFrame(() => {
      popup.classList.add('popup--visible');
    });
  }

  /**
   * Удаляет попап из DOM
   */
  destroy(): void {
    PopupStore.unsubscribe(this.#bindedHandleStoreChange);
    this.#parent.querySelector<HTMLElement>('.popup')?.remove();
  }
}

export default new Popup();
