export type PopupType = {
  message: string;
  duration: number;
  isError: boolean;
};

export type PopupState = {
  current: PopupType | null;
};

export type Listener = (state: PopupState) => void;

export type PopupOptions = {
  message: string;
  duration?: number;
  container?: HTMLElement;
};
