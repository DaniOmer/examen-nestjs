import { Movie } from '../entities/movie.entity';

export interface IWatchedMovieRepository {
  save(watchedMovie: Movie): Promise<Movie>;
  findById(id: string): Promise<Movie | null>;
  findByUserId(userId: string): Promise<Movie[]>;
  findAll(): Promise<Movie[]>;
  delete(id: string): Promise<void>;
}

export const MOVIE_REPOSITORY = Symbol('MOVIE_REPOSITORY');
