import {
  User,
  UserStatus,
  UserRole,
} from 'src/domain/user/entities/user.entity';
import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { UserAlreadyExistsError } from 'src/domain/user/errors/user.error';
import {
  IEmailService,
  IHashingService,
  ITokenService,
} from '../ports/services.ports';
import { IIdGenerator } from 'src/core/ports/id-generator.port';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterOutput {
  userId: string;
  email: string;
  message: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.hashingService.hash(input.password);
    const verificationToken = this.tokenService.generateRandomToken();

    const user = User.create({
      id: this.idGenerator.generate(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashedPassword,
      phoneNumber: input.phoneNumber || null,
      status: UserStatus.PENDING,
      role: UserRole.MEMBER,
      emailVerificationToken: verificationToken,
    });

    await this.userRepository.save(user);
    await this.emailService.sendVerificationEmail(
      input.email,
      verificationToken,
    );

    return {
      userId: user.id,
      email: user.email,
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }
}
