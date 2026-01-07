import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
  Length,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../domain/user/entities/user.entity';

export class RegisterDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password (min 8 characters, must contain uppercase, lowercase, and digit)',
    example: 'Password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User role',
    example: 'MEMBER',
    enum: UserRole,
  })
  @IsEnum(UserRole, {
    message: 'Role must be either ADMIN or MEMBER',
  })
  @IsNotEmpty()
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token',
    example: 'abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyTwoFactorDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Two-factor authentication code (exactly 6 characters)',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, {
    message: 'Code must be exactly 6 characters',
  })
  code: string;
}

// Response DTOs - UserResponseDto doit être défini en premier
export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  phoneNumber?: string | null;

  @ApiProperty({
    description: 'User status',
    example: 'active',
    enum: ['pending', 'active', 'suspended', 'deleted'],
  })
  status: string;

  @ApiProperty({
    description: 'User role',
    example: 'MEMBER',
    enum: ['ADMIN', 'MEMBER'],
  })
  role: string;

  @ApiProperty({
    description: 'Email verification status',
    example: true,
  })
  emailVerified: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: () => UserResponseDto,
  })
  user: UserResponseDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User registered successfully. Please verify your email.',
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: () => UserResponseDto,
  })
  user: UserResponseDto;
}

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Email verified successfully',
  })
  message: string;
}

export class VerifyTwoFactorResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    type: () => UserResponseDto,
  })
  user: UserResponseDto;
}
