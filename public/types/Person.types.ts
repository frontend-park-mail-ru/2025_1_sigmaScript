export type PersonState = {
  photoUrl: string | null;
  nameRu: string | null;
  nameEn: string | null;
  career: string | null;
  height: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  genres: string | null;
  totalFilms: string | null;
  biography: string | null;

  favorite: boolean | null;
};

export type PersonListener = (state: PersonState) => void;

export interface PersonPayload {
  photoUrl: string;
  nameRu: string;
  nameEn: string | null;
  career: string | null;
  height: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  genres: string | null;
  totalFilms: string | null;
  biography: string | null;

  favorite: boolean | null;
}
