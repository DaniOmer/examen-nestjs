import { IMovieRepository } from 'src/domain/movies/repositories/movie.repository';
import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { UserRole } from 'src/domain/user/entities/user.entity';
import { UnauthorizedAccessError } from 'src/domain/user/errors/user.error';

export interface GetAllWatchlistsInput {
  requestingUserRole: string;
}

export interface MovieWithUserEmailOutput {
  id: string;
  userId: string;
  userEmail: string;
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

export interface GetAllWatchlistsOutput {
  movies: MovieWithUserEmailOutput[];
  total: number;
}

export class GetAllWatchlistsUseCase {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetAllWatchlistsInput): Promise<GetAllWatchlistsOutput> {
    if (input.requestingUserRole !== UserRole.ADMIN) {
      throw new UnauthorizedAccessError(
        'Only admins can access all watchlists',
      );
    }

    const movies = await this.movieRepository.findAll();
    const userIds = [...new Set(movies.map((movie) => movie.userId))];
    const users = await Promise.all(
      userIds.map((userId) => this.userRepository.findById(userId)),
    );

    const userMap = new Map(
      users
        .filter((user) => user !== null)
        .map((user) => [user!.id, user!.email]),
    );

    return {
      movies: movies.map((movie) => ({
        id: movie.id,
        userId: movie.userId,
        userEmail: userMap.get(movie.userId) || 'Unknown',
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
