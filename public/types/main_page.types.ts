export type MainPageConfig = {
  id: string;
  headerId: string;
  contentId: string;
  footerId: string;
};

export type MovieDataJSON = {
  id: number;
  title: string;
  preview_url: string;
};

export type MovieCollection = MovieDataJSON[];
