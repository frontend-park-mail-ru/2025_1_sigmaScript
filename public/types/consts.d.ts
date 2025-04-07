declare module 'public/consts' {
  import { Login } from '../components/Login/Login';
  import Input from '../components/universal_input/input';
  type ErrorHandler = (context: Login, input?: Input) => void;
  export const ERRORS: Record<string, string>;
  export const ERROR_HANDLERS: Record<string, ErrorHandler>;
  export const BACKEND_PORT: number;
  export const HOST: string;
  export const AUTH_URL: string;
  export const BASE_URL: string;
  export const AVATAR_PLACEHOLDER: string;
}
