export type NavbarState = {
  parent: HTMLElement | null;
};

export type Listener = (state: NavbarState) => void;
