import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMovieRepository } from 'src/domain/movies/repositories/movie.repository';
import { Movie } from 'src/domain/movies/entities/movie.entity';
import { MovieEntity } from '../models/movie.model';
import { MovieProps } from 'src/domain/movies/entities/movie.entity';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly typeOrmRepository: Repository<MovieEntity>,
  ) {}

  async save(movie: Movie): Promise<Movie> {
    const entity = this.toEntity(movie);
    const savedEntity = await this.typeOrmRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Movie | null> {
    const entity = await this.typeOrmRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Movie[]> {
    const entities = await this.typeOrmRepository.find({
      where: { userId },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<Movie[]> {
    const entities = await this.typeOrmRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }

  private toDomain(entity: MovieEntity): Movie {
    const props: MovieProps = {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      year: entity.year,
      genre: entity.genre,
      director: entity.director,
      rating:
        entity.rating !== null
          ? typeof entity.rating === 'string'
            ? parseFloat(entity.rating)
            : entity.rating
          : null,
      notes: entity.notes,
      watchedAt: entity.watchedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return Movie.reconstitute(props);
  }

  private toEntity(movie: Movie): MovieEntity {
    const props = movie.toJSON();
    const entity = new MovieEntity();
    entity.id = props.id;
    entity.userId = props.userId;
    entity.title = props.title;
    entity.year = props.year;
    entity.genre = props.genre;
    entity.director = props.director;
    entity.rating = props.rating;
    entity.notes = props.notes;
    entity.watchedAt = props.watchedAt;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    return entity;
  }
}
