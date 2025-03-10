import { createID } from '/utils/createID.js';

class Modal {
  #parent;
  #actions = {};
  #config = {};
  #nofunc = () => {};

  constructor(parent, config) {
    this.#parent = parent;

    this.#config.id = config.id || createID();
    this.#config.title = config.title || 'Выход из аккаунта';
    this.#config.message = config.message || 'Вы действительно хотите выйти?';
    this.#config.cancelText = config.cancelText || 'Нет';
    this.#config.confirmText = config.confirmText || 'Да';

    this.#actions.onConfirm = config.onConfirm || this.#nofunc;
    this.#actions.onCancel = config.onCancel || this.#nofunc;
  }

  self() {
    if (!this.#parent) {
      return null;
    }
    return document.getElementById(this.#config.id);
  }

  render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['modal.hbs'];
    this.#parent.insertAdjacentHTML('beforeEnd', template(this.#config));

    this.#applyActions();
  }

  #applyActions() {
    this.#parent.querySelector('.modal_content-confirm').addEventListener('click', () => {
      this.#actions.onConfirm();
      this.destroy();
    });

    this.#parent.querySelector('.modal_content-cancel').addEventListener('click', () => {
      this.#actions.onCancel();
      this.destroy();
    });
  }

  open() {
    this.self().style.display = 'block';
  }

  destroy() {
    if (this.self()) {
      this.self().remove();
    }
  }
}

export default Modal;
