import { IMovieRepository } from 'src/domain/movies/repositories/movie.repository';
import { UserRole } from 'src/domain/user/entities/user.entity';
import { UnauthorizedAccessError } from 'src/domain/user/errors/user.error';

export interface GetUserWatchlistInput {
  userId: string;
  requestingUserId: string;
  requestingUserRole: string;
}

export interface MovieOutput {
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

export interface GetUserWatchlistOutput {
  movies: MovieOutput[];
  total: number;
}

export class GetUserWatchlistUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(input: GetUserWatchlistInput): Promise<GetUserWatchlistOutput> {
    const isAdmin = input.requestingUserRole === UserRole.ADMIN;
    const isOwner = input.userId === input.requestingUserId;

    if (!isAdmin && !isOwner) {
      throw new UnauthorizedAccessError(
        'You can only access your own watchlist',
      );
    }

    const movies = await this.movieRepository.findByUserId(input.userId);

    return {
      movies: movies.map((movie) => ({
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
      })),
      total: movies.length,
    };
  }
}
