import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { NotificationActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { NotificationItem } from 'types/NotiDropdown.types';
import { notificationReceived, websocketConnect, websocketDisconnect, websocketError } from 'flux/Actions';
import { PopupActions } from 'flux/Actions';
import WebSocketService from 'modules/WebSocketService';
import { HOST } from 'public/consts';
import { formatTimestamp } from 'modules/time_serialiser';

const WS_URL = `ws://${HOST}:8080/ws`;

type NotificationState = {
  notifications: NotificationItem[];
  isConnected: boolean;
  error: string | null;
};

type Listener = (state: NotificationState) => void;

class NotificationStore {
  private state: NotificationState;
  private listeners: Array<Listener>;
  private webSocketService: WebSocketService;
  private count: number;

  constructor() {
    this.state = {
      notifications: [],
      isConnected: false,
      error: null
    };
    this.listeners = [];
    this.count = 0;
    this.webSocketService = new WebSocketService(WS_URL);

    this.setupWebSocketListeners();

    dispatcher.register(this.handleActions.bind(this));
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.on('connect', () => {
      websocketConnect();
    });

    this.webSocketService.on('disconnect', () => {
      websocketDisconnect();
    });

    this.webSocketService.on('error', (error) => {
      websocketError(error?.message || 'WebSocket error');
    });

    this.webSocketService.on('notification', (notificationData) => {
      const notification: NotificationItem = {
        id: this.count,
        urlID: notificationData.id || Date.now().toString(),
        title: notificationData.title || 'Новое уведомление',
        text: notificationData.text || notificationData.message || '',
        timestamp: notificationData.date
      };
      ++this.count;
      notificationReceived(notification);
    });
  }

  getUrlIDbyID(id: string): number | null | undefined {
    for (const elem of this.state.notifications) {
      if (elem.id == id) {
        return elem.urlID;
      }
    }
    return null;
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

        if (this.state.notifications.length > 100) {
          this.state.notifications = this.state.notifications.slice(0, 100);
        }

        PopupActions.showPopup({
          title: newNotification.title,
          movieName: newNotification.text,
          releaseDate: formatTimestamp(newNotification.timestamp),
          duration: 2500,
          isNotification: true
        });

        this.emitChange();
        break;

      case NotificationActionTypes.NOTIFICATION_REMOVE:
        const notificationId = action.payload as string;
        this.state.notifications = this.state.notifications.filter((n) => {
          return n.id != notificationId;
        });
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

  /**
   * Подключение к WebSocket
   */
  connect(): void {
    this.webSocketService.connect();
  }

  /**
   * Отключение от WebSocket
   */
  disconnect(): void {
    this.webSocketService.disconnect();
  }

  /**
   * Отправка сообщения через WebSocket (если нужно)
   */
  send(message: any): void {
    this.webSocketService.send(message);
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
