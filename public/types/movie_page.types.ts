export type User = {
  id: number;
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
};

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
  reviews?: Review[];
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

const fightClubReviews: Review[] = [
  {
    id: 1,
    user: { id: 101, login: 'KinoKritik77' }, // Используем login , avatar: 'static/img/1.webp'
    reviewText:
      'Абсолютный шедевр! Фильм, который заставляет задуматься о современном обществе, консьюмеризме и поиске себя. Потрясающая игра актеров и неожиданный финал.',
    score: 10,
    createdAt: new Date('2023-10-15T10:30:00Z').toLocaleDateString('ru-RU') // Дата в формате ISO 8601 (UTC)
  },
  {
    id: 2,
    user: { id: 102, login: 'Alice_F' }, // Используем login
    reviewText:
      'Сначала показался странным и жестоким, но потом поняла глубину. Финал просто взрывает мозг! Пересматривала несколько раз.',
    score: 9,
    createdAt: new Date('2024-01-20T18:05:12Z').toLocaleDateString('ru-RU')
  },
  {
    id: 3,
    user: { id: 103, login: 'Sergey_N' }, // Используем login
    reviewText:
      'Не мое. Слишком много неоправданного насилия и псевдофилософии. Пытается быть глубоким, но выглядит претенциозно. Финал предсказуем, если внимательно смотреть.',
    score: 5,
    createdAt: new Date('2023-11-01T12:00:00Z').toLocaleDateString('ru-RU')
  },
  {
    id: 4,
    user: { id: 205, login: 'Tyler_Fan99' }, // Используем login
    reviewText:
      'Лучший фильм ЭВЕР! Нортон и Питт на высоте. Идея анархии и разрушения системы - то, что нужно! Первое правило - никому не рассказывать!',
    score: 10,
    createdAt: new Date('2024-03-08T22:15:45Z').toLocaleDateString('ru-RU')
  },
  {
    id: 5,
    user: { id: 310, login: 'RegularViewer' }, // Используем login
    reviewText:
      'Интересный фильм с неожиданным поворотом. Хорошая сатира на общество потребления, но местами затянуто. Стоит посмотреть хотя бы раз.',
    score: 7,
    createdAt: new Date('2023-12-25T09:55:00Z').toLocaleDateString('ru-RU')
  }
];

export const fightClub: MovieData = {
  id: 1,
  name: 'Бойцовский клуб',
  releaseYear: 1999,
  about: `Сотрудник страховой компании страдает хронической бессонницей и отчаянно пытается вырваться из мучительно скучной жизни. Однажды в очередной командировке он встречает некоего Тайлера Дёрдена — харизматического торговца мылом с извращенной философией. Тайлер уверен, что самосовершенствование — удел слабых, а единственное, ради чего стоит жить, — саморазрушение. 
  Проходит немного времени, и вот уже новые друзья лупят друг друга почем зря на стоянке перед баром, и очищающий мордобой доставляет им высшее блаженство. Приобщая других мужчин к простым радостям физической жестокости, они основывают тайный Бойцовский клуб, который начинает пользоваться невероятной популярностью.`,
  country: 'США',
  budget: 63000000,
  boxOfficeUS: 37030102,
  boxOfficeGlobal: 100853753,
  duration: '2ч 19м',
  genres: [
    { id: 1, name: 'триллер' },
    { id: 2, name: 'драма' }
  ],
  staff: [
    { id: 1, fullName: 'Брэд Питт', role: 'Тайлер Дёрден' },
    { id: 2, fullName: 'Эдвард Нортон', role: 'Рассказчик' },
    { id: 3, fullName: 'Хелена Бонем Картер', role: 'Марла Сингер' },
    { id: 4, fullName: 'Мит Лоуф', role: 'Роберт Полсон (Большой Боб)' },
    { id: 5, fullName: 'Джаред Лето', role: 'Ангел' },
    { id: 6, fullName: 'Зэк Гренье', role: 'Ричард Чеслин' },
    { id: 7, fullName: 'Холт Маккэллани', role: 'Инспектор Детектив' },
    { id: 8, fullName: 'Эйон Бэйли', role: 'Рики' },
    { id: 9, fullName: 'Ричмонд Аркетт', role: 'Стивен' },
    { id: 10, fullName: 'Дэвид Эндрюс', role: 'Томас' }
  ],
  rating: 8.8,
  reviews: fightClubReviews
};
