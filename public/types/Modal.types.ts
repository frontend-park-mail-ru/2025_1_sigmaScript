export type InputConfig = {
  id: string;
  name: string;
  inputClasses?: string;
  text?: string;
  placeholder?: string;
  type?: string;
  actions?: { [key: string]: (...args: unknown[]) => unknown };
};

export type UniversalModalConfig = {
  id?: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  inputs?: InputConfig[];
  onConfirm?: () => void;
  onCancel?: () => void;
};
