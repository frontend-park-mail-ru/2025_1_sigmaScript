import { NotificationDropdownConfig, NotificationItem } from 'types/Notification.types';
import template from './NotiDropdown.hbs';

class NotificationDropdown {
  private id: string;
  private title: string;
  private notifications: NotificationItem[];
  private parent: HTMLElement;
  public container: HTMLElement | null = null;
  private scrollHandler: (e: Event) => void;
  private onNotificationClick?: (id: string) => void;
  private onNotificationRemove?: (id: string) => void;
  private documentClickHandler?: (e: MouseEvent) => void;

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

      if (menu.contains(tgt) || tgt.closest('.notification-item-close')) {
        return;
      }
      menu.classList.remove('active');
      window.removeEventListener('scroll', this.scrollHandler);
    };
  }

  render(): void {
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

  self(): HTMLElement | null {
    return this.container?.querySelector(`#${this.id}_menu`) || null;
  }

  private bindEvents(): void {
    if (!this.container) return;
    const menu = this.self();
    if (!menu) return;

    const newMenu = menu.cloneNode(true);
    if (menu.parentNode) {
      menu.parentNode.replaceChild(newMenu, menu);
    }

    newMenu.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      const closeButton = target.closest('.notification-item-close');
      if (closeButton) {
        e.stopPropagation(); 
        console.log('Close button clicked');

        const id = closeButton.getAttribute('data-id');
        if (id) {
          console.log('Removing notification with id:', id);
          this.notifications = this.notifications.filter((n) => n.id !== id);

          const currentMenu = this.self();
          const isActive = currentMenu?.classList.contains('active');

          this.container!.innerHTML = template({
            id: this.id,
            title: this.title,
            notifications: this.notifications
          });

          if (isActive) {
            const newMenuAfterUpdate = this.self();
            if (newMenuAfterUpdate) {
              newMenuAfterUpdate.classList.add('active');
            }
          }

          this.bindEvents();

          this.onNotificationRemove?.(id);
        }
        return;
      }

      const item = target.closest('.notification-item');
      if (item) {
        const id = item.getAttribute('data-id');
        if (id) {
          this.onNotificationClick?.(id);
        }
      }
    });

    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler, false);
    }

    document.addEventListener('click', this.documentClickHandler!, false);
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.updateNotifications(this.notifications);
  }

  public addNotification(notification: NotificationItem): void {
    this.notifications.push(notification);
    this.updateNotifications(this.notifications);
  }

  public toggle(parent: HTMLElement): void {
    if (!this.container) return;
    const rect = parent.getBoundingClientRect();
    const menu = this.self();
    if (!menu) return;

    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      window.removeEventListener('scroll', this.scrollHandler);
      return;
    }

    menu.style.visibility = 'hidden';
    menu.classList.add('active');

    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const margin = 20;
    const mobileBreakpoint = 768;
    let leftPosition: number;

    if (viewportWidth <= mobileBreakpoint) {
      leftPosition = rect.right + scrollX;
      if (leftPosition + menuRect.width > viewportWidth - margin + scrollX) {
        leftPosition = viewportWidth - menuRect.width - margin + scrollX;
      }
    } else {
      leftPosition = rect.left - menuRect.width + scrollX;
      if (leftPosition < margin + scrollX) {
        leftPosition = margin + scrollX;
      }
    }

    this.container.style.position = 'absolute';
    this.container.style.top = `${rect.bottom + scrollY}px`;
    this.container.style.left = `${leftPosition}px`;

    menu.style.visibility = 'visible';
    window.addEventListener('scroll', this.scrollHandler);
  }

  public updateNotifications(notifications: NotificationItem[]): void {
    this.notifications = notifications;
    if (this.container) {
      const currentMenu = this.self();
      const isActive = currentMenu?.classList.contains('active');

      this.container.innerHTML = template({
        id: this.id,
        title: this.title,
        notifications: this.notifications
      });

      if (isActive) {
        const newMenuAfterUpdate = this.self();
        if (newMenuAfterUpdate) {
          newMenuAfterUpdate.classList.add('active');
        }
      }

      this.bindEvents();
    }
  }

  destroy(): void {
    if (this.container?.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler, false);
    }
    window.removeEventListener('scroll', this.scrollHandler);
  }
}

export default NotificationDropdown;
