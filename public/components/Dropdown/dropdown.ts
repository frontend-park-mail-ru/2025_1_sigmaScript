import { DropdownConfig, DropdownItem } from 'types/Dropdown.types';
import template from './dropdown.hbs';

class Dropdown {
  private id: string;
  private items: DropdownItem[];
  private parent: HTMLElement;
  public container: HTMLElement | null = null;
  private scrollHandler: (e: Event) => void;

  constructor(config: DropdownConfig) {
    this.id = config.id;
    this.items = config.items;
    this.parent = config.parent;

    // при скролле убираем меню
    this.scrollHandler = () => {
      if (this.self() && this.self()?.classList.contains('active')) {
        this.self()?.classList.remove('active');
        window.removeEventListener('scroll', this.scrollHandler);
      }
    };
  }

  render(): void {
    this.container = document.createElement('div');
    this.container.classList.add('dropdown-container');
    this.container.innerHTML = template({
      id: this.id,
      items: this.items.map(({ id, label, visible }) => ({
        id,
        label,
        visible: visible !== false
      }))
    });
    this.parent.appendChild(this.container);

    this.bindEvents();
  }

  self(): HTMLElement | null {
    return this.container?.querySelector(`#${this.id}_menu`) || null;
  }

  private bindEvents(): void {
    if (!this.container) {
      return;
    }

    this.self()?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('dropdown-item')) {
        const itemId = target.getAttribute('data-id');
        const item = this.items.find((i) => i.id === itemId);
        if (item && item.onClick) {
          item.onClick(e);
        }

        this.self()?.classList.remove('active');
      }
    });

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Node;
      if (this.container && !this.container.contains(target)) {
        this.self()?.classList.remove('active');
      }
    });
  }

  /**
   * Рисует выпадающий список под заданным элементом
   *
   * @param parent Элемент, относительно которого будет позиционироваться меню
   */
  public toggle(parent: HTMLElement): void {
    if (!this.container) {
      return;
    }

    const rect = parent.getBoundingClientRect();
    const menu = this.self();
    if (menu) {
      const menuWidth = menu.offsetWidth;
      const leftPosition = rect.right + window.scrollX - menuWidth;

      this.container.style.position = 'absolute';
      this.container.style.top = rect.bottom + window.scrollY + 'px';
      this.container.style.left = leftPosition + 'px';

      if (!menu.classList.contains('active')) {
        menu.classList.add('active');
        window.addEventListener('scroll', this.scrollHandler);
      } else {
        menu.classList.remove('active');
        window.removeEventListener('scroll', this.scrollHandler);
      }
    }
  }

  /**
   * Изменяет видимость элемента.
   * @param itemId ID пункта меню
   * @param show
   */
  public updateItemVisibility(itemId: string, show: boolean): void {
    const menuItem = this.container?.querySelector(`.dropdown-item[data-id="${itemId}"]`);
    if (menuItem) {
      if (show) {
        menuItem.classList.remove('hidden');
      } else {
        menuItem.classList.add('hidden');
      }
    }
  }

  destroy(): void {
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    this.self()?.remove();

    window.removeEventListener('scroll', this.scrollHandler);
  }
}

export default Dropdown;
