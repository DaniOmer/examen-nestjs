import { Movie } from 'src/domain/movies/entities/movie.entity';
import { IMovieRepository } from 'src/domain/movies/repositories/movie.repository';
import { IIdGenerator } from 'src/core/ports/id-generator.port';

export interface AddMovieInput {
  userId: string;
  title: string;
  year: number;
  genre?: string;
  director?: string;
  rating?: number;
  notes?: string;
  watchedAt?: Date;
}

export interface AddMovieOutput {
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

export class AddMovieUseCase {
  constructor(
    private readonly movieRepository: IMovieRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(input: AddMovieInput): Promise<AddMovieOutput> {
    const movie = Movie.create({
      id: this.idGenerator.generate(),
      userId: input.userId,
      title: input.title,
      year: input.year,
      genre: input.genre || null,
      director: input.director || null,
      rating: input.rating || null,
      notes: input.notes || null,
      watchedAt: input.watchedAt || new Date(),
    });

    const savedMovie = await this.movieRepository.save(movie);

    return {
      id: savedMovie.id,
      userId: savedMovie.userId,
      title: savedMovie.title,
      year: savedMovie.year,
      genre: savedMovie.genre,
      director: savedMovie.director,
      rating: savedMovie.rating,
      notes: savedMovie.notes,
      watchedAt: savedMovie.watchedAt,
      createdAt: savedMovie.createdAt,
      updatedAt: savedMovie.updatedAt,
    };
  }
}
