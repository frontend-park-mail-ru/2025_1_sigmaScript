import { MovieCollection } from './main_page.types';
import { PersonJSONCollection } from './Person.types';
import { ActorsMap, MoviesMap } from './UserPage.types';

export type SearchJSONState = {
  movieCollection?: MovieCollection;
  actors?: PersonJSONCollection;
};

export type SearchPageState = {
  movieCollection: MoviesMap;
  actorCollection: ActorsMap;
};

export type Listener = (state: SearchPageState) => void;
