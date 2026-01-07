import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Release year of the movie (1888-2100)',
    example: 1999,
    minimum: 1888,
    maximum: 2100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1888)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({
    description: 'Genre of the movie',
    example: 'Sci-Fi',
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Director of the movie',
    example: 'Lana Wachowski, Lilly Wachowski',
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({
    description: 'Rating of the movie (1-10)',
    example: 9,
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Personal notes about the movie',
    example: 'Mind-bending sci-fi classic',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date when the movie was watched (ISO 8601 format)',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  watchedAt?: string;
}

export class UpdateMovieDto {
  @ApiPropertyOptional({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Release year of the movie (1888-2100)',
    example: 1999,
    minimum: 1888,
    maximum: 2100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1888)
  @Max(2100)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    description: 'Genre of the movie',
    example: 'Sci-Fi',
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Director of the movie',
    example: 'Lana Wachowski, Lilly Wachowski',
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({
    description: 'Rating of the movie (1-10)',
    example: 9,
    minimum: 1,
    maximum: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Personal notes about the movie',
    example: 'Mind-bending sci-fi classic',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date when the movie was watched (ISO 8601 format)',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  watchedAt?: string;
}

// Response DTOs
export class MovieResponseDto {
  @ApiProperty({
    description: 'Movie ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who owns this movie',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Title of the movie',
    example: 'The Matrix',
  })
  title: string;

  @ApiProperty({
    description: 'Release year of the movie',
    example: 1999,
  })
  year: number;

  @ApiPropertyOptional({
    description: 'Genre of the movie',
    example: 'Sci-Fi',
  })
  genre: string | null;

  @ApiPropertyOptional({
    description: 'Director of the movie',
    example: 'Lana Wachowski, Lilly Wachowski',
  })
  director: string | null;

  @ApiPropertyOptional({
    description: 'Rating of the movie (1-10)',
    example: 9,
  })
  rating: number | null;

  @ApiPropertyOptional({
    description: 'Personal notes about the movie',
    example: 'Mind-bending sci-fi classic',
  })
  notes: string | null;

  @ApiProperty({
    description: 'Date when the movie was watched',
    example: '2024-01-15T10:30:00.000Z',
  })
  watchedAt: Date;

  @ApiProperty({
    description: 'Date when the movie was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the movie was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class MovieListResponseDto {
  @ApiProperty({
    description: 'List of movies',
    type: [MovieResponseDto],
  })
  movies: MovieResponseDto[];

  @ApiProperty({
    description: 'Total count of movies',
    example: 10,
  })
  total: number;
}
