import { MovieCollection } from 'types/main_page.types';
import { PersonCollection } from './Person.types';
import { Reviews } from './movie_page.types';

export type UserPageState = {
  parent: HTMLElement | null;
  userData: UserData | null;
  movieCollection: MovieCollection | null;
  actorCollection: PersonCollection | null;
  reviews: Reviews | null;
};

export type Listener = (state: UserPageState) => void;

export interface UserData {
  username: string;
  avatar?: string;
  createdAt: string;
  rating?: number;
  moviesCount?: number;
  actorsCount?: number;
}

export type TabData = {
  id: string;
  label: string;
};

export interface UserPageData extends UserData {
  id: string;
  tabsData?: TabData[];
  userData?: UserData;
}

export type UpdateUserData = {
  username: string;
  avatar?: string;
  oldPassword: string;
  newPassword: string;
  repeatedNewPassword: string;
};

export type ButtonConfig = {
  id: string;
  color: string;
  text: string;
  textColor: string;
  actions?: {
    click: () => Promise<void>;
  };
};
