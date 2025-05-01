import template from './popup.hbs';
import PopupStore from 'store/PopupStore';
import { PopupActions } from 'flux/Actions';

import type { PopupState } from 'types/Popup.types';

export class Popup {
  #parent: HTMLElement;
  #boundRender: (state: PopupState) => void;
  #unsubscribe: () => void;

  /**
   * @param parent — контейнер для вставки попапа (по умолчанию document.body)
   */
  constructor(parent?: HTMLElement) {
    this.#parent = parent ?? document.body;
    this.#boundRender = this.#render.bind(this);
    PopupStore.subscribe(this.#boundRender);
    this.#unsubscribe = () => PopupStore.unsubscribe(this.#boundRender);

    // один раз сразу отрисовать на случай, если store уже содержит popup
    this.#render(PopupStore.getState());
  }

  /**
   * Работает при любом изменении состояния PopupStore.
   * Если появился новый popup — рендерим его.
   * Если popup удалён из store — запускаем анимацию скрытия.
   */
  #render(state: PopupState): void {
    const existing = this.#parent.querySelector<HTMLElement>('.popup');

    // 1) Если store.current === null, а DOM-попап есть — плавно скрыть и удалить
    if (!state.current && existing) {
      // запускаем CSS-анимацию скрытия
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

    // 2) Если store.current есть — удаляем старый сразу (если он ещё не удалён)
    if (state.current && existing) {
      existing.remove();
    }

    // 3) Если нет данных для показа — выходим
    const popupData = state.current;
    if (!popupData) {
      return;
    }

    // 4) Компилируем и вставляем новый попап
    const html = template({ message: popupData.message, isError: popupData.isError });
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const el = wrapper.firstElementChild as HTMLElement;

    // клик по кресту → dispatch hide
    const btn = el.querySelector<HTMLElement>('.popup__close');
    if (btn) {
      btn.addEventListener('click', () => {
        PopupActions.hidePopup();
      });
    }

    this.#parent.appendChild(el);
    // запуск CSS-анимации появления
    requestAnimationFrame(() => {
      el.classList.add('popup--visible');
    });
  }

  /**
   * Отписываемся от Store и сразу удаляем любой «висящий» popup
   */
  destroy(): void {
    this.#unsubscribe();
    const existing = this.#parent.querySelector<HTMLElement>('.popup');
    if (existing) {
      existing.remove();
    }
  }
}

export default new Popup();
