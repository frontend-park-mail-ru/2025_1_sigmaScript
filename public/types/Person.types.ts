import { MovieCollection } from './main_page.types';
import { MoviesMap } from './UserPage.types';

export type PersonInfo = {
  personID: number | string | null;
  nameRu: string | null;
  nameEn: string | null;
  photoUrl: string | null;
  biography: string | null;
  gender: string | null;
  height: string | null;
  dateOfBirth: string | null;
  dateOfDeath: string | null;
  career: string | null;
  genres: string | null;
  totalFilms: string | null;

  favorite: boolean | null;

  movieCollection: MoviesMap;
};

export type PersonCardInfo = {
  personID: number | string | null;
  nameRu: string | null;
  photoUrl: string | null;
};

export type PersonCollection = PersonCardInfo[];

export type PersonsMap = Map<number, PersonInfo>;

export type PersonState = {
  persons: PersonsMap;
  error: string | null;
};

export type PersonListener = (state: PersonState) => void;

export interface PersonPayload {
  id: number | string;
  full_name: string;
  en_full_name: string | null;
  photo: string;
  about: string | null;
  sex: string | null;
  growth: string | null;
  birthday: string | null;
  death: string | null;

  career: string | null;
  genres: string | null;
  total_films: string | null;

  favorite: boolean | null;

  movie_collection: MovieCollection | null;
}
