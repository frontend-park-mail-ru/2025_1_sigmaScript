export type NavbarState = {
  parent: HTMLElement | null;
  needTabID: string | null;
};

export type Listener = (state: NavbarState) => void;
