import './Carousel.scss';
import template from './Carousel.handlebars';

/**
 * Карусель изображений
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {Array} config.images - массив объектов с изображениями и их описанием
 * @param {number} config.visibleCount - количество видимых изображений
 * @param {number} config.current - индекс текущего изображения
 * @param {number} config.interval - интервал смены изображений
 * @param {boolean} config.outbound - слайдер на 20% превышает слайды
 * @param {Function} config.onSlideChange - функция, вызываемая при изменении изображения
 * @returns
 */
export const Carousel = (parent, config) => {
  config.images = config.images || [];
  config.current = config.current || 0;
  config.visibleCount = config.visibleCount || 3;
  config.outbound = config.outbound || false;
  config.onSlideChange = config.onSlideChange || (() => {});

  const self = () => {
    return parent.querySelector('.carousel');
  };

  const destroy = () => {
    if (self()) {
      self().remove();
    }
  };

  const changeConfig = (newConfig) => {
    config = { ...config, ...newConfig };

    if (self()) {
      destroy();
      render();
    }
  };

  const slideTo = (index) => {
    if (index < 0 || index >= config.images.length || index === config.current) {
      return;
    }

    // смена изображения
    const slider = self().querySelector('.carousel__slider');

    // коэффициент смещения слайдера
    if (config.outbound) {
      const steps = Array(config.images.length - 1).fill(80);
      steps[0] = 70;
      steps[steps.length - 1] = 70;

      const offset = steps.reduce((sum, step, i) => {
        if (i < index) {
          return sum + step + 3;
        }
        return sum;
      }, 0);
      slider.style.transform = `translateX(-${offset}%)`;
      slider.style.transition = 'transform 0.5s ease-in-out';
    } else {
      slider.style.transform = `translateX(-${index * 100}%)`;
    }

    config.current = index;
  };

  const prevSlide = () => {
    slideTo(config.current - 1 < 0 ? config.images.length - 1 : config.current - 1);
  };

  const nextSlide = () => {
    slideTo(config.current + 1 >= config.images.length ? 0 : config.current + 1);
  };

  const applyActions = () => {
    if (config.outbound) {
      const slider = self().querySelector('.carousel__slider');
      const slides = self().querySelectorAll('.carousel__slide');

      slider.classList.add('carousel__slider_outbound');
      slides.forEach((slide) => {
        slide.classList.add('carousel__slide_outbound');
      });
    }

    if (config.outbound) {
      // смена слайда при клике на слайд
      self().style.aspectRatio = 125 / 100;
      const slides = self().querySelectorAll('.carousel__slide');
      slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
          slideTo(index);
        });
      });
    } else {
      // смена слайда при промотке мыши вдоль слайдера
      const slider = self().querySelector('.carousel__slider');
      slider.addEventListener('mousemove', (event) => {
        if (event.target.classList.contains('carousel__slide')) {
          let index = parseInt((event.offsetX / event.target.offsetWidth) * config.images.length);
          slideTo(index);
        }
      });
    }
  };

  const render = () => {
    if (self()) {
      throw new Error('Объект уже есть на странице');
    }

    parent.insertAdjacentHTML('beforeend', template(config));

    slideTo(config.current);
    applyActions();
  };

  return {
    self,
    destroy,
    changeConfig,
    slideTo,
    prevSlide,
    nextSlide,
    render
  };
};
