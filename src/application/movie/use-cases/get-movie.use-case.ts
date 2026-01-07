import { IMovieRepository } from 'src/domain/movies/repositories/movie.repository';
import {
  MovieNotFoundError,
  MovieAccessDeniedError,
} from 'src/domain/movies/errors/movie.error';
import { UserRole } from 'src/domain/user/entities/user.entity';

export interface GetMovieInput {
  movieId: string;
  requestingUserId: string;
  requestingUserRole: string;
}

export interface GetMovieOutput {
  id: string;
  userId: string;
  title: string;
  year: number;
  genre: string | null;
  director: string | null;
  rating: number | null;
  notes: string | null;
  watchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class GetMovieUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(input: GetMovieInput): Promise<GetMovieOutput> {
    const movie = await this.movieRepository.findById(input.movieId);

    if (!movie) {
      throw new MovieNotFoundError(input.movieId);
    }

    const isAdmin = input.requestingUserRole === UserRole.ADMIN;
    const isOwner = movie.belongsToUser(input.requestingUserId);

    if (!isAdmin && !isOwner) {
      throw new MovieAccessDeniedError();
    }

    return {
      id: movie.id,
      userId: movie.userId,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      director: movie.director,
      rating: movie.rating,
      notes: movie.notes,
      watchedAt: movie.watchedAt,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    };
  }
}
