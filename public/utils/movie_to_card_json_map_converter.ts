import { CardConfig } from 'components/Card/Card';
import { MovieDataJSON } from 'types/main_page.types';

// /**
//  * Функция конверсии массива MovieDataJSON в CardConfig
//  */
// export const ConvertMovieJSONToCardConfigs = (movies: MovieDataJSON[]): CardConfig[] => {
//   return movies.map((movie) => ({
//     // Преобразуем ID в строку
//     id: movie.id.toString(),
//     // Переименовываем preview_url в previewUrl
//     previewUrl: movie.preview_url,
//     // Копируем заголовок без изменений
//     title: movie.title,
//     // Оставляем остальные необязательные свойства undefined
//     url: undefined,
//     width: undefined,
//     height: undefined,
//     text: movie.duration
//   }));
// };

export function ConvertMovieJSONToCardConfigs(
  movies: MovieDataJSON[],
  cardWidth: string = '200',
  cardHeight: string = '300'
): CardConfig[] {
  return movies.map((movie) => ({
    id: String(movie.id), // Преобразуем числовой id в строковый
    previewUrl: movie.preview_url,
    title: movie.title,
    text: movie.duration,
    url: `/movie/${movie.id}`,

    width: cardWidth,
    height: cardHeight
  }));
}
