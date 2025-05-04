// User - без изменений
export type User = {
  login: string;
  avatar?: string;
};

// Person - добавляем enFullName и делаем остальные доп. поля необязательными
export type Person = {
  id: number;
  fullName: string;
  enFullName?: string; // Добавлено для соответствия Go JSON
  photo?: string;
  // Поля ниже могут отсутствовать в данных от бэка для текущей структуры PersonJSON
  about?: string;
  sex?: string;
  growth?: string;
  birthday?: string; // Если будет приходить дата, лучше использовать string (как в Go) или парсить на фронте
  death?: string; // Аналогично birthday
  role?: string; // Это поле не приходит с бэка сейчас
  // Можно добавить profession, enProfession, description, если планируется расширение PersonJSON на бэке
};

// Review - без изменений (createdAt уже string)
export type Review = {
  id: number;
  user: User;
  reviewText: string;
  score: number;
  createdAt: string; // Соответствует string в Go
};

// NewReviewDataJSON - без изменений
export type NewReviewDataJSON = {
  reviewText: string;
  score: number;
};

// Reviews - без изменений
export type Reviews = Review[];

// Genre - без изменений (id будет 0, если бэк не передает)
export type Genre = {
  id: number;
  name: string;
};

// --- НОВЫЙ ТИП ---
// Соответствует WatchProviderJSON из Go
export type WatchProvider = {
  name: string;
  logoUrl: string; // json:"logo_url" -> logoUrl (camelCase)
  movieUrl: string; // json:"movie_url" -> movieUrl (camelCase)
};

// MovieData - обновляем типы дат и добавляем новые поля
export type MovieData = {
  id: number;
  name: string;
  originalName?: string; // Добавлено
  about?: string;
  shortDescription?: string; // Добавлено
  poster?: string; // Постер фильма (previewUrl)
  logo?: string; // Логотип фильма (url) - Добавлено
  backdrop?: string; // Фоновое изображение (previewUrl) - Добавлено
  releaseYear?: number;
  country?: string;
  slogan?: string;
  director?: string;
  isFavourite?: boolean;
  budget?: number; // Тип number соответствует Go int64
  boxOfficeUS?: number; // Тип number соответствует Go int64
  boxOfficeGlobal?: number; // Тип number соответствует Go int64
  boxOfficeRussia?: number; // Тип number соответствует Go int64
  premierRussia?: string; // ИЗМЕНЕНО: Date -> string (соответствует Go string)
  premierGlobal?: string; // ИЗМЕНЕНО: Date -> string (соответствует Go string)
  rating?: number; // Тип number соответствует Go float64
  ratingKp?: number; // Тип number соответствует Go float64
  ratingImdb?: number; // Тип number соответствует Go float64
  duration?: string; // Тип string соответствует Go string
  genres?: Genre[];
  staff?: Person[]; // Использует обновленный тип Person
  reviews?: Reviews;
  watchability?: WatchProvider[]; // Добавлено (массив новых объектов)
};

// DisplayField - без изменений
export type DisplayField = {
  title: string;
  value: string;
};

// keysToShow - обновляем, добавляем originalName.
// Поля вроде shortDescription, logo, backdrop, watchability обычно отображаются иначе,
// не просто как "ключ: значение", поэтому их можно не добавлять сюда, если они не нужны в таком виде.
export const keysToShow: Array<keyof MovieData> = [
  'releaseYear',
  'country',
  'genres', // Потребует специальной обработки (map по массиву)
  'slogan',
  'director',
  'staff', // Потребует специальной обработки (map по массиву)
  'duration',
  'budget', // Потребует форматирования (например, добавления валюты, если она известна или передается отдельно)
  'boxOfficeUS', // Потребует форматирования
  'boxOfficeGlobal', // Потребует форматирования
  'boxOfficeRussia', // Потребует форматирования
  'premierRussia', // Потребует форматирования даты из строки
  'premierGlobal', // Потребует форматирования даты из строки
  'originalName' // Добавлено
];

export const fieldTranslations = {
  // Поля MovieData
  id: 'ID',
  name: 'Название',
  originalName: 'Оригинальное название', // Добавлено
  about: 'Описание',
  shortDescription: 'Краткое описание', // Добавлено
  poster: 'Постер',
  logo: 'Логотип фильма', // Добавлено
  backdrop: 'Фоновое изображение', // Добавлено
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
  staff: 'В ролях и создатели', // Уточнено
  reviews: 'Отзывы',
  watchability: 'Где смотреть', // Добавлено

  // Роли персон (можно расширять)
  personRoles: {
    actor: 'Актёр',
    director: 'Режиссёр',
    producer: 'Продюсер',
    writer: 'Сценарист',
    operator: 'Оператор',
    composer: 'Композитор'
    // Добавить 'designer', 'editor', 'voice_actor' и т.д. при необходимости
  },

  // Поля Person
  fullName: 'Имя',
  enFullName: 'Имя (англ.)', // Добавлено
  photo: 'Фото',
  sex: 'Пол',
  growth: 'Рост',
  birthday: 'Дата рождения',
  death: 'Дата смерти'
  // Можно добавить 'profession', 'enProfession', 'description'

  // Можно добавить переводы для полей WatchProvider, если они выводятся отдельно
  // watchProviderName: 'Платформа',
  // watchProviderLogoUrl: 'URL Логотипа',
  // watchProviderMovieUrl: 'URL Фильма',
} as const;
