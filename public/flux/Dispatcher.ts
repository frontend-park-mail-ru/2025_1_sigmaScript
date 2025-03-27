import { Action } from 'types/Dispatcher.types';

type DispatchCallback = (action: Action) => void;

class Dispatcher {
  private readonly callbacks: DispatchCallback[] = [];

  /**
   * Регистрирует колбэк для обработки действий
   * @param callback - функция-обработчик, которая будет вызвана при dispatch
   */
  register(callback: DispatchCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Рассылает действие всем зарегистрированным обработчикам
   * @param action - action
   */
  dispatch<TPayload>(action: Action<TPayload>): void {
    this.callbacks.forEach((callback) => callback(action));
  }
}

export const dispatcher = new Dispatcher();
