import { createID } from 'utils/createID';
import template from './modal.hbs';
import Input from 'components/universal_input/input';
import Button from 'components/universal_button/button.js';
import { UniversalModalConfig, InputConfig } from 'types/Modal.types';
import { ButtonConfig } from 'types/UserPage.types';

class UniversalModal {
  #parent: HTMLElement;
  #config: UniversalModalConfig;
  #inputs: Record<string, Input>;
  #actions: { onConfirm: () => void; onCancel: () => void } = { onConfirm: () => {}, onCancel: () => {} };
  #addClasses: string[];
  #nofunc = () => {};

  constructor(parent: HTMLElement, config: UniversalModalConfig) {
    this.#parent = parent;
    this.#config = {
      id: config.id || createID(),
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText !== undefined ? config.confirmText : 'Да',
      cancelText: config.cancelText !== undefined ? config.cancelText : 'Нет',
      inputs: config.inputs || [],
      buttons: config.buttons || []
    };

    this.#addClasses = config.addClasses || [];

    this.#inputs = {};

    this.#actions.onConfirm = config.onConfirm || this.#nofunc;
    this.#actions.onCancel = config.onCancel || this.#nofunc;
  }

  self(): HTMLElement | null {
    return document.getElementById(this.#config.id!);
  }

  #applyClasses(): void {
    const self = this.self();
    if (self && this.#addClasses.length > 0) {
      self.classList.add(...this.#addClasses);
    }
  }

  render(): void {
    this.#parent.insertAdjacentHTML('beforeend', template(this.#config));

    const modalElem = this.self();
    if (modalElem) {
      if (this.#config.confirmText) {
        const confirmContainer = modalElem.querySelector('.modal_confirm_btn_container');
        if (confirmContainer) {
          const confirmBtn = new Button(confirmContainer, {
            id: `confirmBtn`,
            text: this.#config.confirmText,
            color: 'primary',
            textColor: 'primary',
            actions: {
              click: () => {
                this.#actions.onConfirm();
                this.destroy();
              }
            },
            addClasses: ['modal_button']
          });
          confirmBtn.render();
        }
      }

      if (this.#config.cancelText) {
        const cancelContainer = modalElem.querySelector('.modal_cancel_btn_container');
        if (cancelContainer) {
          const cancelBtn = new Button(cancelContainer, {
            id: `cancelBtn`,
            text: this.#config.cancelText,
            color: 'primary',
            textColor: 'primary',
            actions: {
              click: () => {
                this.#actions.onCancel();
                this.destroy();
              }
            },
            addClasses: ['modal_button']
          });
          cancelBtn.render();
        }
      }
    }

    if (this.#config.inputs && this.#config.inputs.length > 0) {
      const inputsContainer = this.self()?.querySelector('.modal_content__inputs');
      if (inputsContainer) {
        this.#config.inputs.forEach((inputConfig: InputConfig) => {
          const input = new Input(inputsContainer, inputConfig);
          this.#inputs[inputConfig.name] = input;
          input.render();
        });
      }
    }

    if (this.#config.buttons && this.#config.buttons.length > 0) {
      const bttnsContainer = this.self()?.querySelector('.modal_content__buttons');
      if (bttnsContainer) {
        this.#config.buttons.forEach((bttnConfig: ButtonConfig) => {
          const buttn = new Button(bttnsContainer, bttnConfig);
          buttn.render();
        });
      }
    }

    this.#applyActions();
    this.#applyClasses();
  }

  getInputByName(name: string): Input {
    return this.#inputs[name];
  }

  #applyActions(): void {
    const modalElem = this.self();
    if (!modalElem) return;

    modalElem.querySelector('.modal_overlay')?.addEventListener('click', (e: Event) => {
      if (e.target === modalElem.querySelector('.modal_overlay')) {
        this.destroy();
      }
    });

    const closeBtn = modalElem.querySelector('.modal_close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.destroy();
      });
    }

    modalElem.querySelector('.modal_content')?.addEventListener('click', (e: Event) => {
      e.stopPropagation();
    });
  }

  open(): void {
    const modalElem = this.self();
    if (modalElem) {
      modalElem.style.display = 'block';
    }
  }

  destroy(): void {
    this.self()?.remove();
  }
}

export default UniversalModal;
