import { CardConfig } from 'components/Card/Card';
import { MovieDataJSON } from 'types/main_page.types';

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
