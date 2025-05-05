export type MainPageConfig = {
  id: string;
  headerId: string;
  contentId: string;
  footerId: string;
};

export type MovieDataJSON = {
  id: number;
  title: string;
  rating: number;
  previewUrl: string;
  duration?: string;
  releaseDate?: string;
};

export type MovieCollection = MovieDataJSON[];

export type Collections = Record<string, MovieCollection>;
