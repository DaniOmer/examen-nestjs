import { DomainError } from 'src/core/domain/errors/domain.error';

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password');
  }
}

export class EmailNotVerifiedError extends DomainError {
  constructor() {
    super('Email not verified. Please verify your email first.');
  }
}

export class InvalidVerificationTokenError extends DomainError {
  constructor() {
    super('Invalid or expired verification token');
  }
}

export class InvalidTwoFactorCodeError extends DomainError {
  constructor() {
    super('Invalid or expired two-factor authentication code');
  }
}

export class UserSuspendedError extends DomainError {
  constructor() {
    super('User account is suspended');
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}
