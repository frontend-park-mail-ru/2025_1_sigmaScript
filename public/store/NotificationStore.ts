import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { NotificationActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { NotificationItem } from 'types/Notification.types';
import { notificationReceived, websocketConnect, websocketDisconnect, websocketError } from 'flux/Actions';
import { PopupActions } from 'flux/Actions';

const MOCK_NOTIFICATIONS = [
  { title: 'Премьера фильма', text: 'Дэдпул и Росомаха - уже в кинотеатрах!' },
  { title: 'Новый сезон', text: 'Ходячие мертвецы - 3 серия уже доступна' },
  { title: 'Рекомендация', text: 'Посмотрите "Человек-паук: Через вселенные"' },
  { title: 'Скоро в кино', text: 'Аватар 3 - премьера 20 декабря 2024' },
  { title: 'Топ недели', text: 'Oppenheimer стал самым популярным фильмом' },
  { title: 'Новинка', text: 'Добавлен новый фильм "Дюна: Часть вторая"' },
  { title: 'Акция', text: 'Скидка 20% на премиум подписку' },
  { title: 'Уведомление', text: 'Ваш любимый актер снялся в новом фильме' }
];

type NotificationState = {
  notifications: NotificationItem[];
  isConnected: boolean;
  error: string | null;
};

type Listener = (state: NotificationState) => void;

class NotificationStore {
  private state: NotificationState;
  private listeners: Array<Listener>;

  private mockInterval: number | null = null;
  private mockIndex = 0;

  constructor() {
    this.state = {
      notifications: [],
      isConnected: false,
      error: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private startMockNotifications(): void {
    if (this.mockInterval) return;

    console.log('🔔 Starting mock notifications...');

    this.mockInterval = window.setInterval(() => {
      const mockData = MOCK_NOTIFICATIONS[this.mockIndex % MOCK_NOTIFICATIONS.length];
      const notification: NotificationItem = {
        id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: mockData.title,
        text: mockData.text
      };

      console.log('📢 Mock notification:', notification);
      notificationReceived(notification);
      this.mockIndex++;
    }, 60000);

    setTimeout(() => {
      const firstNotification: NotificationItem = {
        id: `first_${Date.now()}`,
        title: 'Добро пожаловать!',
        text: 'Теперь вы будете получать уведомления'
      };
      notificationReceived(firstNotification);
    }, 3000);
  }

  private stopMockNotifications(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
      console.log('❌ Mock notifications stopped');
    }
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case NotificationActionTypes.WEBSOCKET_CONNECT:
        this.state.isConnected = true;
        this.state.error = null;
        this.emitChange();
        break;

      case NotificationActionTypes.WEBSOCKET_DISCONNECT:
        this.state.isConnected = false;
        this.emitChange();
        break;

      case NotificationActionTypes.WEBSOCKET_ERROR:
        this.state.error = action.payload as string;
        this.state.isConnected = false;
        this.emitChange();
        break;

      case NotificationActionTypes.NOTIFICATION_RECEIVED:
      case NotificationActionTypes.NOTIFICATION_ADD:
        const newNotification = action.payload as NotificationItem;
        this.state.notifications.unshift(newNotification);

        PopupActions.showPopup({
          title: newNotification.title,
          movieName: newNotification.text,
          releaseDate: '12 июня 2025 года',
          duration: 2500,
          isNotification: true
        });

        this.emitChange();
        break;

      case NotificationActionTypes.NOTIFICATION_REMOVE:
        const notificationId = action.payload as string;
        this.state.notifications = this.state.notifications.filter((n) => n.id !== notificationId);
        this.emitChange();
        break;

      case NotificationActionTypes.NOTIFICATIONS_CLEAR:
        this.state.notifications = [];
        this.emitChange();
        break;

      case UserPageTypes.LOGOUT_USER:
        this.disconnect();
        this.state.notifications = [];
        this.state.isConnected = false;
        this.state.error = null;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  connect(): void {
    console.log('🔌 Connecting to notifications...');
    this.startMockNotifications();
    websocketConnect();
  }

  disconnect(): void {
    console.log('🔌 Disconnecting from notifications...');
    this.stopMockNotifications();
    websocketDisconnect();
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private emitChange(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState(): NotificationState {
    return { ...this.state };
  }
}

export default new NotificationStore();
