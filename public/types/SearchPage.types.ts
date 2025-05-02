import { MovieCollection } from 'types/main_page.types';
import { PersonCollection } from 'types/Person.types';

export type SearchPageState = {
  movieCollection: MovieCollection | null;
  actorCollection: PersonCollection | null;
};

export type Listener = (state: SearchPageState) => void;
