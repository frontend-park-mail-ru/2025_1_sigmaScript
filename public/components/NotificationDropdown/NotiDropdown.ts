import { NotificationDropdownConfig, NotificationItem } from 'types/NotiDropdown.types';
import template from './NotiDropdown.hbs';

class NotificationDropdown {
  private id: string;
  private title: string;
  private notifications: NotificationItem[];
  private parent: HTMLElement;
  public container: HTMLElement | null = null;
  private scrollHandler: (e: Event) => void;
  private documentClickHandler: (e: MouseEvent) => void;
  private onNotificationClick?: (id: string) => void;
  private onNotificationRemove?: (id: string) => void;

  constructor(config: NotificationDropdownConfig) {
    this.id = config.id;
    this.title = config.title || 'Уведомления';
    this.notifications = config.notifications || [];
    this.parent = config.parent;
    this.onNotificationClick = config.onNotificationClick;
    this.onNotificationRemove = config.onNotificationRemove;

    this.scrollHandler = () => {
      const menu = this.self();
      if (menu?.classList.contains('active')) {
        menu.classList.remove('active');
        window.removeEventListener('scroll', this.scrollHandler);
      }
    };

    this.documentClickHandler = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      const menu = this.self();
      if (!menu) return;
      if (menu.contains(tgt) || tgt.closest('.notification-item-close')) return;
      if (tgt.closest('.navbar__menu')) {
        menu.classList.remove('active');
        window.removeEventListener('scroll', this.scrollHandler);
        return;
      }
      menu.classList.remove('active');
      window.removeEventListener('scroll', this.scrollHandler);
    };
  }

  public render(): void {
    this.container = document.createElement('div');
    this.container.classList.add('notification-dropdown-container');
    this.container.innerHTML = template({
      id: this.id,
      title: this.title,
      notifications: this.notifications
    });
    this.parent.appendChild(this.container);
    this.bindEvents();
  }

  public self(): HTMLElement | null {
    return this.container?.querySelector<HTMLElement>(`#${this.id}_menu`) || null;
  }

  private bindEvents(): void {
    if (!this.container) return;
    const menu = this.self();
    if (!menu) return;

    const newMenu = menu.cloneNode(true) as HTMLElement;
    menu.parentNode!.replaceChild(newMenu, menu);
    newMenu.addEventListener('click', (e: Event) => {
      const tgt = e.target as HTMLElement;
      const closeBtn = tgt.closest('.notification-item-close');
      if (closeBtn) {
        e.stopPropagation();
        const id = closeBtn.getAttribute('data-id')!;
        this.notifications = this.notifications.filter((n) => n.id !== id);
        const wasActive = this.self()?.classList.contains('active');
        this.container!.innerHTML = template({ id: this.id, title: this.title, notifications: this.notifications });
        if (wasActive) this.self()!.classList.add('active');
        this.bindEvents();
        this.onNotificationRemove?.(id);
        return;
      }
      const item = tgt.closest('.notification-item');
      if (item) {
        this.onNotificationClick?.(item.getAttribute('data-id')!);
      }
    });

    document.removeEventListener('click', this.documentClickHandler);
    document.addEventListener('click', this.documentClickHandler);
  }

  public toggle(anchor: HTMLElement): void {
    if (!this.container) return;
    const menu = this.self();
    if (!menu) return;

    if (menu.classList.toggle('active')) {
      window.addEventListener('scroll', this.scrollHandler);
    } else {
      window.removeEventListener('scroll', this.scrollHandler);
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const mw = menu.offsetWidth;
    const vw = window.innerWidth;
    const sx = window.scrollX,
      sy = window.scrollY;
    let left = vw < 768 ? Math.min(rect.right + sx, vw - mw - 20 + sx) : Math.max(20 + sx, rect.left - mw + sx);

    this.container.style.position = 'absolute';
    this.container.style.top = `${rect.bottom + sy}px`;
    this.container.style.left = `${left}px`;
  }

  public updateNotifications(list: NotificationItem[]): void {
    this.notifications = list;
    if (!this.container) return;
    const wasActive = this.self()?.classList.contains('active');
    this.container.innerHTML = template({ id: this.id, title: this.title, notifications: this.notifications });
    if (wasActive) this.self()!.classList.add('active');
    this.bindEvents();
  }

  public destroy(): void {
    if (this.container?.parentElement) this.container.parentElement.removeChild(this.container);
    document.removeEventListener('click', this.documentClickHandler);
    window.removeEventListener('scroll', this.scrollHandler);
  }

  public close(): void {
    const menu = this.self();
    if (menu?.classList.contains('active')) {
      menu.classList.remove('active');
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

export default NotificationDropdown;
