import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { UserStatus } from 'src/domain/user/entities/user.entity';
import {
  InvalidCredentialsError,
  EmailNotVerifiedError,
  UserSuspendedError,
} from 'src/domain/user/errors/user.error';
import {
  ITokenService,
  IEmailService,
  IHashingService,
} from '../ports/services.ports';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  requiresTwoFactor: boolean;
  message: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UserSuspendedError();
    }

    if (!user.isEmailVerified()) {
      throw new EmailNotVerifiedError();
    }

    const isPasswordValid = await this.hashingService.compare(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const twoFactorCode = this.tokenService.generateTwoFactorCode();
    user.setTwoFactorCode(twoFactorCode, 10);

    await this.userRepository.save(user);
    await this.emailService.sendTwoFactorCode(input.email, twoFactorCode);

    return {
      requiresTwoFactor: true,
      message: 'Two-factor authentication code sent to your email.',
    };
  }
}
