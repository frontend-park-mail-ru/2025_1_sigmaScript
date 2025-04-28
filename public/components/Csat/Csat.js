import './Csat.css'; // Импортируем выделенный файл CSS
import template from './Csat.hbs';
import CsatStore from 'store/NavbarStore';

/**
 * Модальное окно CSAT (Customer Satisfaction)
 * @param {HTMLElement} parent - родительский элемент, к которому будет добавлен компонент
 * @param {Object} config - конфигурация
 * @param {string} config.frontUrl - базовый URL для iframe
 * @param {Function} config.onClose - функция, вызываемая при закрытии модального окна
 * @param {Function} config.onSubmit - функция, вызываемая при отправке формы из iframe
 * @returns {Class}
 */
class CsatModal {
  #parent;
  #config;
  #modalOverlay;
  #modalContent;
  #iframe;

  /**
   * @param {HTMLElement} parent - родительский элемент
   * @param {Object} config - конфигурация
   */
  constructor(parent, config = {}) {
    this.#parent = parent;
    this.#config = {
      frontUrl: config.frontUrl || '',
      onClose: config.onClose || (() => {}),
      onSubmit: config.onSubmit || (() => {})
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
    this.handleIframeError = this.handleIframeError.bind(this);

    this.messageHandler = this.messageHandler.bind(this);

    // сделать handleStore
    // this.bindedHandleStoreChange = this.handleStoreChange.bind(this);
    // CsatStore.subscribe(this.bindedHandleStoreChange);
  }

  /**
   * Получить ссылку на DOM-элемент модального окна
   * @returns {HTMLElement}
   */
  self() {
    return this.#modalOverlay;
  }

  /**
   * Удалить компонент из DOM
   */
  destroy() {
    if (this.#modalOverlay) {
      window.removeEventListener('message', this.messageHandler);
      this.#modalOverlay.removeEventListener('click', this.handleOverlayClick);

      if (this.#iframe) {
        this.#iframe.removeEventListener('load', this.handleIframeLoad);
        this.#iframe.removeEventListener('error', this.handleIframeError);
      }

      this.#parent.removeChild(this.#modalOverlay);

      this.#modalOverlay = null;
      this.#modalContent = null;
      this.#iframe = null;

      document.body.style.overflow = '';
    }
    CsatStore.unsubscribe(this.bindedHandleStoreChange);
  }

  /**
   * Закрыть модальное окно с анимацией
   */
  closeModal() {
    if (this.#modalOverlay) {
      this.#modalOverlay.classList.remove('csat-overlay--visible');
      this.#removeActions();
      this.destroy();
      this.#config.onClose();
    }
  }

  /**
   * Обработчик клика по оверлею
   * @param {MouseEvent} e - событие клика
   */
  handleOverlayClick(e) {
    if (e.target === this.#modalOverlay) {
      this.closeModal();
    }
  }

  /**
   * Обработчик успешной загрузки iframe
   */
  handleIframeLoad() {
    if (!this.#iframe || !this.#modalContent) {
      return;
    }

    const contentWidth = this.#iframe.offsetWidth;
    const contentHeight = this.#iframe.offsetHeight;

    this.#modalContent.style.width = `${contentWidth}px`;
    this.#modalContent.style.height = `${contentHeight}px`;

    this.#modalOverlay.classList.add('csat-overlay--visible');
    this.#modalContent.classList.add('csat-content--loaded');
  }

  /**
   * Обработчик ошибки загрузки iframe
   */
  handleIframeError() {
    console.error('Failed to load iframe');
    this.destroy();
  }

  /**
   * Обработчик сообщений от iframe
   * @param {MessageEvent} event - событие сообщения
   */
  handleStoreChange() {
    // TODO: сделать handleStore
  }

  messageHandler() {
    this.closeModal();
  }

  /**
   * Отрисовка компонента
   */
  render() {
    if (!this.#parent) {
      return;
    }

    const container = document.createElement('div');

    container.innerHTML = template({
      frontUrl: this.#config.frontUrl
    });

    this.#modalOverlay = container.querySelector('.csat-overlay');
    this.#modalContent = container.querySelector('.csat-content');
    this.#iframe = container.querySelector('.csat-iframe');

    this.#parent.appendChild(this.#modalOverlay);

    this.#iframe.addEventListener('load', this.handleIframeLoad);
    this.#iframe.addEventListener('error', this.handleIframeError);
    this.#modalOverlay.addEventListener('click', this.handleOverlayClick);

    window.addEventListener('message', this.messageHandler);

    document.body.style.overflow = 'hidden';
  }

  #removeActions() {
    this.#iframe.removeEventListener('load', this.handleIframeLoad);
    this.#iframe.removeEventListener('error', this.handleIframeError);
    this.#modalOverlay.removeEventListener('click', this.handleOverlayClick);

    window.removeEventListener('message', this.messageHandler);
  }
}

export default CsatModal;
