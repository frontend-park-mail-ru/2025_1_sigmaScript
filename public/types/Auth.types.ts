export type User = {
  login: string;
};

export type AuthState = {
  user: User | null;
  error: string | null;
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  repeatPassword: string;
}

export type AuthSuccessPayload = {
  user: User;
};

export type ErrorPayload = {
  error: string;
};

export type Listener = (state: AuthState) => void;
