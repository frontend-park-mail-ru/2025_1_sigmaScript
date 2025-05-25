import { NotificationItem } from 'types/Notification.types';

type WebSocketEventType = 'notification' | 'connect' | 'disconnect' | 'error';

interface WebSocketMessage {
  type: WebSocketEventType;
  data?: any;
}

type WebSocketListener = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<WebSocketEventType, WebSocketListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor(private url: string) {
    this.initializeListeners();
  }

  private initializeListeners(): void {
    this.listeners.set('notification', []);
    this.listeners.set('connect', []);
    this.listeners.set('disconnect', []);
    this.listeners.set('error', []);
  }

  /**
   * Подключаемся к WebSocket серверу
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.emit('error', error);
      this.isConnecting = false;
    }
  }

  /**
   * Настраиваем обработчики событий WebSocket
   */
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.emit('connect', null);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        switch (message.type) {
          case 'notification':
            this.emit('notification', message.data);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnecting = false;
      this.emit('disconnect', null);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.emit('error', error);
    };
  }

  /**
   * Попытка переподключения
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Подписка на события
   */
  on(event: WebSocketEventType, listener: WebSocketListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(listener);
    }
  }

  /**
   * Отписка от событий
   */
  off(event: WebSocketEventType, listener: WebSocketListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Эмит события
   */
  private emit(event: WebSocketEventType, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Отправка сообщения на сервер
   */
  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  /**
   * Закрытие соединения
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Проверка состояния подключения
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default WebSocketService;
