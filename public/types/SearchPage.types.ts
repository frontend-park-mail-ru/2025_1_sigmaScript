import { ActorsMap, MoviesMap } from './UserPage.types';

export type SearchPageState = {
  movieCollection: MoviesMap;
  actorCollection: ActorsMap;
};

export type Listener = (state: SearchPageState) => void;
