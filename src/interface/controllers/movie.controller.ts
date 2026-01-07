import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser } from '../../infrastructure/http/decorators/current-user.decorator';
import { Roles } from '../../infrastructure/http/decorators/roles.decorator';
import { UserRole } from '../../domain/user/entities/user.entity';
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieResponseDto,
  MovieListResponseDto,
} from '../dtos/movie.dto';
import { AddMovieUseCase } from '../../application/movie/use-cases/add-movie.use-case';
import { GetMovieUseCase } from '../../application/movie/use-cases/get-movie.use-case';
import { GetUserWatchlistUseCase } from '../../application/movie/use-cases/get-user-watchlist.use-case';
import { GetAllWatchlistsUseCase } from '../../application/movie/use-cases/get-all-watchlists.use-case';
import type { TokenPayload } from '../../application/user/ports/services.ports';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
export class MovieController {
  constructor(
    private readonly addMovieUseCase: AddMovieUseCase,
    private readonly getMovieUseCase: GetMovieUseCase,
    private readonly getUserWatchlistUseCase: GetUserWatchlistUseCase,
    private readonly getAllWatchlistsUseCase: GetAllWatchlistsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new movie to watchlist' })
  @ApiResponse({
    status: 201,
    description: 'Movie added successfully',
    type: MovieResponseDto,
  })
  async createMovie(
    @Body() dto: CreateMovieDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<MovieResponseDto> {
    const result = await this.addMovieUseCase.execute({
      userId: user.userId,
      title: dto.title,
      year: dto.year,
      genre: dto.genre,
      director: dto.director,
      rating: dto.rating,
      notes: dto.notes,
      watchedAt: dto.watchedAt ? new Date(dto.watchedAt) : undefined,
    });

    return {
      id: result.id,
      userId: result.userId,
      title: result.title,
      year: result.year,
      genre: result.genre,
      director: result.director,
      rating: result.rating,
      notes: result.notes,
      watchedAt: result.watchedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie found',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getMovie(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<MovieResponseDto> {
    const result = await this.getMovieUseCase.execute({
      movieId: id,
      requestingUserId: user.userId,
      requestingUserRole: user.role,
    });

    return {
      id: result.id,
      userId: result.userId,
      title: result.title,
      year: result.year,
      genre: result.genre,
      director: result.director,
      rating: result.rating,
      notes: result.notes,
      watchedAt: result.watchedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get('watchlist/:userId')
  @ApiOperation({ summary: 'Get user watchlist' })
  @ApiResponse({
    status: 200,
    description: 'Watchlist retrieved successfully',
    type: MovieListResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getUserWatchlist(
    @Param('userId') userId: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<MovieListResponseDto> {
    const result = await this.getUserWatchlistUseCase.execute({
      userId,
      requestingUserId: user.userId,
      requestingUserRole: user.role,
    });

    return {
      movies: result.movies.map((movie) => ({
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
      total: result.total,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all watchlists (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All watchlists retrieved successfully',
    type: MovieListResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Access denied - Admin only' })
  async getAllWatchlists(
    @CurrentUser() user: TokenPayload,
  ): Promise<MovieListResponseDto> {
    const result = await this.getAllWatchlistsUseCase.execute({
      requestingUserRole: user.role,
    });

    return {
      movies: result.movies.map((movie) => ({
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
      total: result.total,
    };
  }
}
