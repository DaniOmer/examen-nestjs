import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../infrastructure/http/decorators/public-endpoint.decorator';
import { CurrentUser } from '../../infrastructure/http/decorators/current-user.decorator';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  VerifyTwoFactorDto,
  RegisterResponseDto,
  UserResponseDto,
  VerifyEmailResponseDto,
  VerifyTwoFactorResponseDto,
} from '../dtos/auth.dto';
import { RegisterUseCase } from '../../application/user/use-cases/register.use-case';
import { LoginUseCase } from '../../application/user/use-cases/login.use-case';
import { VerifyEmailUseCase } from '../../application/user/use-cases/verify-email.use-case';
import { VerifyTwoFactorUseCase } from '../../application/user/use-cases/verify-two-factor.use-case';
import { GetCurrentUserUseCase } from '../../application/user/use-cases/get-current-user.use-case';
import type { TokenPayload } from '../../application/user/ports/services.ports';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly verifyTwoFactorUseCase: VerifyTwoFactorUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    const result = await this.registerUseCase.execute({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      phoneNumber: dto.phoneNumber,
    });

    return {
      message: result.message,
      user: {
        id: result.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: result.email,
        phoneNumber: dto.phoneNumber || null,
        status: 'pending',
        role: 'MEMBER',
        emailVerified: false,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, two-factor code sent',
    schema: {
      type: 'object',
      properties: {
        requiresTwoFactor: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({
    status: 403,
    description: 'Email not verified or user suspended',
  })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    const result = await this.verifyEmailUseCase.execute({
      token: dto.token,
    });

    return {
      message: result.message,
    };
  }

  @Public()
  @Post('verify-two-factor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify two-factor authentication code' })
  @ApiResponse({
    status: 200,
    description: 'Two-factor verified, access token returned',
    type: VerifyTwoFactorResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid two-factor code' })
  async verifyTwoFactor(
    @Body() dto: VerifyTwoFactorDto,
  ): Promise<VerifyTwoFactorResponseDto> {
    const result = await this.verifyTwoFactorUseCase.execute({
      email: dto.email,
      code: dto.code,
    });

    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        phoneNumber: null,
        status: 'active',
        role: result.user.role,
        emailVerified: true,
      },
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(
    @CurrentUser() user: TokenPayload,
  ): Promise<UserResponseDto> {
    const result = await this.getCurrentUserUseCase.execute({
      userId: user.userId,
    });

    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      phoneNumber: result.phoneNumber,
      status: result.status,
      role: result.role,
      emailVerified: result.emailVerifiedAt !== null,
    };
  }
}
