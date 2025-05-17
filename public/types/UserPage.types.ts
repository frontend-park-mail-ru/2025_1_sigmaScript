import { MovieCollection, MovieDataJSON } from 'types/main_page.types';
import { PersonCardInfo, PersonCollection, PersonJSONCollection } from './Person.types';
import { Review, Reviews } from './movie_page.types';

export type MoviesMap = Map<number, MovieDataJSON>;
export type ActorsMap = Map<number, PersonCardInfo>;
export type ReviewsMap = Map<number, Review>;

export type UserPageState = {
  parent: HTMLElement | null;
  userData: UserData | null;
  movieCollection: MoviesMap;
  actorCollection: ActorsMap;
  reviews: ReviewsMap;
  needTabID: string | null;
};

export type Listener = (state: UserPageState) => void;

export interface UserData {
  username: string;
  avatar?: string;
  createdAt: string;
  rating?: number;
  moviesCount?: number;
  actorsCount?: number;
  movieCollection?: MovieCollection;
  actors?: PersonJSONCollection;
  reviews?: Reviews;
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

export type UpdateLoginData = {
  username: string;
  password: string;
};

export type UpdatePasswordData = {
  username: string;
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
