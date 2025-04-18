import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { LoginActionTypes, RenderActionTypes } from 'flux/ActionTypes.ts';
import { AUTH_URL } from 'public/consts';
import { Listener, AuthState, LoginPayload, RegisterPayload, AuthSuccessPayload, ErrorPayload } from 'types/Auth.types';
import request, { ErrorWithDetails } from 'utils/fetch';
import { Login } from 'components/Login/Login.ts';
import { initialStore } from './InitialStore';
import { router } from '../modules/router';

class AuthStore {
  private state: AuthState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      user: null,
      error: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  private handleActions(action: Action): void {
    switch (action.type) {
      case LoginActionTypes.LOGIN_SUBMIT:
        this.login(action.payload as LoginPayload);
        break;
      case LoginActionTypes.REGISTER_SUBMIT:
        this.register(action.payload as RegisterPayload);
        break;
      case LoginActionTypes.LOGIN_SUCCESS:
      case LoginActionTypes.REGISTER_SUCCESS:
        this.state.user = (action.payload as AuthSuccessPayload).user;
        this.state.error = null;
        this.emitChange();
        break;
      case LoginActionTypes.LOGIN_ERROR:
      case LoginActionTypes.REGISTER_ERROR:
        this.state.error = (action.payload as ErrorPayload).error;
        this.emitChange();
        break;
      case RenderActionTypes.RENDER_AUTH_REG_PAGE:
        this.renderAuth();
        break;
      default:
        break;
    }
  }

  private renderAuth() {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }
    initialStore.destroyStored();
    const login = new Login(rootElement, router.getCurrentPath(), 0);
    initialStore.store(login);

    login.render();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof ErrorWithDetails) {
      return error.errorDetails.error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Unknown error';
  }

  private async login({ username, password }: LoginPayload): Promise<void> {
    try {
      const url = AUTH_URL + 'login';
      const body = {
        username,
        password
      };
      const responseData = await request({ url, method: 'POST', body, credentials: true });
      const user = responseData.body;
      dispatcher.dispatch({
        type: LoginActionTypes.LOGIN_SUCCESS,
        payload: { user }
      });
    } catch (error: unknown) {
      dispatcher.dispatch({
        type: LoginActionTypes.LOGIN_ERROR,
        payload: { error: this.getErrorMessage(error) }
      });
    }
  }

  private async register({ username, password, repeatPassword }: RegisterPayload): Promise<void> {
    try {
      const url = AUTH_URL + 'register';
      const body = {
        username,
        password,
        repeated_password: repeatPassword
      };
      const responseData = await request({ url, method: 'POST', body, credentials: true });
      const user = responseData.body;
      dispatcher.dispatch({
        type: LoginActionTypes.REGISTER_SUCCESS,
        payload: { user }
      });
    } catch (error: unknown) {
      dispatcher.dispatch({
        type: LoginActionTypes.REGISTER_ERROR,
        payload: { error: this.getErrorMessage(error) }
      });
    }
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState(): AuthState {
    return this.state;
  }
}

export default new AuthStore();
