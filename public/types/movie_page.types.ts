export type User = {
  login: string;
  avatar?: string;
};

export type Person = {
  id: number;
  fullName: string;
  photo?: string;
  about?: string;
  sex?: string;
  growth?: string;
  birthday?: Date;
  death?: Date;
  role?: string;
};

export type Review = {
  id: number;
  user: User;
  reviewText: string;
  score: number;
  createdAt: string;
  movieID?: number;
};

export type NewReviewDataJSON = {
  reviewText: string;
  score: number;
};

export type Reviews = Review[];

export type Genre = {
  id: number;
  name: string;
};

export type MovieData = {
  id: number;
  name: string;
  about?: string;
  poster?: string;
  releaseYear?: number;
  country?: string;
  slogan?: string;
  director?: string;
  budget?: number;
  boxOfficeUS?: number;
  boxOfficeGlobal?: number;
  boxOfficeRussia?: number;
  premierRussia?: Date;
  premierGlobal?: Date;
  rating?: number;
  duration?: string;
  genres?: Genre[];
  staff?: Person[];
  reviews?: Reviews;
};

export type DisplayField = {
  title: string;
  value: string;
};

export const keysToShow: Array<keyof MovieData> = [
  'releaseYear',
  'country',
  'genres',
  'slogan',
  'director',
  'staff',
  'duration',
  'budget',
  'boxOfficeUS',
  'boxOfficeGlobal',
  'boxOfficeRussia',
  'premierRussia',
  'premierGlobal'
];

export const fieldTranslations = {
  id: 'ID',
  name: 'Название',
  originalName: 'Оригинальное название',
  about: 'Описание',
  poster: 'Постер',
  releaseYear: 'Год выпуска',
  country: 'Страна',
  slogan: 'Слоган',
  director: 'Режиссёр',
  budget: 'Бюджет',
  boxOfficeUS: 'Сборы в США',
  boxOfficeGlobal: 'Сборы в мире',
  boxOfficeRussia: 'Сборы в России',
  premierGlobal: 'Премьера в мире',
  premierRussia: 'Премьера в России',
  rating: 'Рейтинг',
  duration: 'Время',
  genres: 'Жанры',
  staff: 'Состав',
  reviews: 'Отзывы',
  personRoles: {
    actor: 'Актёр',
    director: 'Режиссёр',
    producer: 'Продюсер',
    writer: 'Сценарист',
    operator: 'Оператор',
    composer: 'Композитор'
  },
  fullName: 'Имя',
  photo: 'Фото',
  sex: 'Пол',
  growth: 'Рост',
  birthday: 'Дата рождения',
  death: 'Дата смерти'
} as const;
