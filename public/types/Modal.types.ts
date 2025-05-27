import { ButtonConfig } from './UserPage.types';

export type InputConfig = {
  id: string;
  name: string;
  inputClasses?: string;
  text?: string;
  placeholder?: string;
  type?: string;
  accept?: string;
  actions?: { [key: string]: (...args: unknown[]) => unknown };
};

export type UniversalModalConfig = {
  id?: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  inputs?: InputConfig[];
  buttons?: ButtonConfig[];
  onConfirm?: () => void;
  onCancel?: () => void;
  addClasses?: string[];
  abc?: string;
  stars: boolean;
  csat?: boolean;
};
