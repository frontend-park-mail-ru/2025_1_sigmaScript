/**
 * Функция плавной прокрутки к элементу.
 * @param {string} selector - CSS селектор элемента
 * @param {number} offset - отступ сверху (по умолчанию 80px для навбара)
 */
export function scrollToElement(selector: string, offset: number = 80): void {
  const element = document.querySelector(selector);
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
