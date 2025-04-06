export type UserPageState = {
  parent: HTMLElement | null;
  userData: UserData | null;
};

export type Listener = (state: UserPageState) => void;

export interface UserData {
  login: string;
  avatar?: string;
  birthDate?: string;
  registrationDate: string;
  rating?: number;
  moviesCount?: number;
  seriesCount?: number;
}

export type TabData = {
  id: string;
  label: string;
};

export interface UserPageData extends UserData {
  id: string;
  tabsData?: TabData[];
}

export type ButtonConfig = {
  id: string;
  color: string;
  text: string;
  textColor: string;
  actions: {
    click: () => Promise<void>;
  };
};
