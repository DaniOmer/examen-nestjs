import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { InvalidVerificationTokenError } from 'src/domain/user/errors/user.error';

export interface VerifyEmailInput {
  token: string;
}

export interface VerifyEmailOutput {
  success: boolean;
  message: string;
}

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: VerifyEmailInput): Promise<VerifyEmailOutput> {
    const user = await this.userRepository.findByEmailVerificationToken(
      input.token,
    );

    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    user.verifyEmail();
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Email verified successfully. You can now log in.',
    };
  }
}
