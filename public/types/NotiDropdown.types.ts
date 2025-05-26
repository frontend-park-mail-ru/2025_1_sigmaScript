export type NotificationItem = {
  id: string;
  urlID?: number;
  title: string;
  text: string;
  timestamp?: Date;
  isRead?: boolean;
};

export type NotificationDropdownConfig = {
  id: string;
  parent: HTMLElement;
  title?: string;
  notifications: NotificationItem[];
  onNotificationClick?: (id: string) => void;
  onNotificationRemove?: (id: string) => void;
};
