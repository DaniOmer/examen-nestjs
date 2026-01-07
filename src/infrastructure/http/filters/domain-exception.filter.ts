import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from 'src/core/domain/errors/domain.error';
import { UserNotFoundError } from 'src/domain/user/errors/user.error';
import { MovieNotFoundError } from 'src/domain/movies/errors/movie.error';
import { UserAlreadyExistsError } from 'src/domain/user/errors/user.error';
import { InvalidCredentialsError } from 'src/domain/user/errors/user.error';
import { InvalidTwoFactorCodeError } from 'src/domain/user/errors/user.error';
import { InvalidVerificationTokenError } from 'src/domain/user/errors/user.error';
import { EmailNotVerifiedError } from 'src/domain/user/errors/user.error';
import { UserSuspendedError } from 'src/domain/user/errors/user.error';
import { MovieAccessDeniedError } from 'src/domain/movies/errors/movie.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = this.getStatusCode(exception);
    const error = this.getErrorName(statusCode);

    const errorResponse = {
      statusCode,
      error,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorResponse);
  }

  private getStatusCode(exception: DomainError): number {
    if (exception instanceof UserNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof MovieNotFoundError) {
      return HttpStatus.NOT_FOUND;
    }
    if (exception instanceof UserAlreadyExistsError) {
      return HttpStatus.CONFLICT;
    }
    if (exception instanceof InvalidCredentialsError) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof InvalidTwoFactorCodeError) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (exception instanceof InvalidVerificationTokenError) {
      return HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof EmailNotVerifiedError) {
      return HttpStatus.FORBIDDEN;
    }
    if (exception instanceof UserSuspendedError) {
      return HttpStatus.FORBIDDEN;
    }
    if (exception instanceof MovieAccessDeniedError) {
      return HttpStatus.FORBIDDEN;
    }
    return HttpStatus.BAD_REQUEST;
  }

  private getErrorName(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.BAD_REQUEST:
      default:
        return 'Bad Request';
    }
  }
}
