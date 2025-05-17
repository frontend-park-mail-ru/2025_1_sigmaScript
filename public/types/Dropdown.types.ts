export type DropdownItem = {
  id: string;
  label: string;
  visible?: boolean;
  onClick?: (event: Event) => void;
};

export type DropdownConfig = {
  id: string;
  items: DropdownItem[];
  parent: HTMLElement;
};
