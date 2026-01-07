import { DomainError } from 'src/core/domain/errors/domain.error';

export class MovieNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Movie not found: ${id}`);
  }
}

export class MovieAccessDeniedError extends DomainError {
  constructor() {
    super('You do not have access to this movie');
  }
}

export class InvalidRatingError extends DomainError {
  constructor() {
    super('Rating must be between 1 and 10');
  }
}
