import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/models/user.model';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/user/repositories/user.repository.interface';
import { TokenService } from '../../infrastructure/services/token.service';
import { EmailService } from '../../infrastructure/services/email.service';
import { HashingService } from '../../infrastructure/services/hashing.service';
import {
  TOKEN_SERVICE,
  EMAIL_SERVICE,
  HASHING_SERVICE,
} from './ports/services.ports';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { VerifyTwoFactorUseCase } from './use-cases/verify-two-factor.use-case';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { IdGeneratorService } from '../../infrastructure/services/id-generator.service';
import { ID_GENERATOR } from '../../core/ports/id-generator.port';
import { AuthController } from '../../interface/controllers/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    // Services
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: EmailService,
    },
    {
      provide: HASHING_SERVICE,
      useClass: HashingService,
    },
    {
      provide: ID_GENERATOR,
      useClass: IdGeneratorService,
    },
    // Use Cases avec useFactory
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepository,
        hashingService,
        tokenService,
        emailService,
        idGenerator,
      ) => {
        return new RegisterUseCase(
          userRepository,
          hashingService,
          tokenService,
          emailService,
          idGenerator,
        );
      },
      inject: [
        USER_REPOSITORY,
        HASHING_SERVICE,
        TOKEN_SERVICE,
        EMAIL_SERVICE,
        ID_GENERATOR,
      ],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository,
        hashingService,
        tokenService,
        emailService,
      ) => {
        return new LoginUseCase(
          userRepository,
          hashingService,
          tokenService,
          emailService,
        );
      },
      inject: [USER_REPOSITORY, HASHING_SERVICE, TOKEN_SERVICE, EMAIL_SERVICE],
    },
    {
      provide: VerifyEmailUseCase,
      useFactory: (userRepository) => {
        return new VerifyEmailUseCase(userRepository);
      },
      inject: [USER_REPOSITORY],
    },
    {
      provide: VerifyTwoFactorUseCase,
      useFactory: (userRepository, tokenService) => {
        return new VerifyTwoFactorUseCase(userRepository, tokenService);
      },
      inject: [USER_REPOSITORY, TOKEN_SERVICE],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (userRepository) => {
        return new GetCurrentUserUseCase(userRepository);
      },
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [
    TOKEN_SERVICE,
    RegisterUseCase,
    LoginUseCase,
    VerifyEmailUseCase,
    VerifyTwoFactorUseCase,
    GetCurrentUserUseCase,
  ],
})
export class UserModule {}
