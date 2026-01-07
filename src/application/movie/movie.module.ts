import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '../../infrastructure/models/movie.model';
import { MovieRepository } from '../../infrastructure/repositories/movie.repository';
import { MOVIE_REPOSITORY } from '../../domain/movies/repositories/movie.repository';
import { UserEntity } from '../../infrastructure/models/user.model';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/user/repositories/user.repository.interface';
import { IdGeneratorService } from '../../infrastructure/services/id-generator.service';
import { ID_GENERATOR } from '../../core/ports/id-generator.port';
import { AddMovieUseCase } from './use-cases/add-movie.use-case';
import { GetMovieUseCase } from './use-cases/get-movie.use-case';
import { GetUserWatchlistUseCase } from './use-cases/get-user-watchlist.use-case';
import { GetAllWatchlistsUseCase } from './use-cases/get-all-watchlists.use-case';
import { MovieController } from '../../interface/controllers/movie.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, UserEntity])],
  controllers: [MovieController],
  providers: [
    // Repositories
    {
      provide: MOVIE_REPOSITORY,
      useClass: MovieRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: ID_GENERATOR,
      useClass: IdGeneratorService,
    },
    {
      provide: AddMovieUseCase,
      useFactory: (movieRepository, idGenerator) => {
        return new AddMovieUseCase(movieRepository, idGenerator);
      },
      inject: [MOVIE_REPOSITORY, ID_GENERATOR],
    },
    {
      provide: GetMovieUseCase,
      useFactory: (movieRepository) => {
        return new GetMovieUseCase(movieRepository);
      },
      inject: [MOVIE_REPOSITORY],
    },
    {
      provide: GetUserWatchlistUseCase,
      useFactory: (movieRepository) => {
        return new GetUserWatchlistUseCase(movieRepository);
      },
      inject: [MOVIE_REPOSITORY],
    },
    {
      provide: GetAllWatchlistsUseCase,
      useFactory: (movieRepository, userRepository) => {
        return new GetAllWatchlistsUseCase(movieRepository, userRepository);
      },
      inject: [MOVIE_REPOSITORY, USER_REPOSITORY],
    },
  ],
  exports: [
    AddMovieUseCase,
    GetMovieUseCase,
    GetUserWatchlistUseCase,
    GetAllWatchlistsUseCase,
  ],
})
export class MovieModule {}
