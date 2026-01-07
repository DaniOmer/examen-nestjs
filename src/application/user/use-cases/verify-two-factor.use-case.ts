import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { InvalidTwoFactorCodeError } from 'src/domain/user/errors/user.error';
import { ITokenService, TokenPayload } from '../ports/services.ports';

export interface VerifyTwoFactorInput {
  email: string;
  code: string;
}

export interface VerifyTwoFactorOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export class VerifyTwoFactorUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: VerifyTwoFactorInput): Promise<VerifyTwoFactorOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidTwoFactorCodeError();
    }

    if (!user.isTwoFactorCodeValid(input.code)) {
      throw new InvalidTwoFactorCodeError();
    }

    user.clearTwoFactorCode();
    await this.userRepository.save(user);

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
