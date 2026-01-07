import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type {
  ITokenService,
  TokenPayload,
} from '../../application/user/ports/services.ports';
import * as crypto from 'crypto';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    const secret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'access-secret',
    );
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );

    return this.jwtService.sign(
      payload as Record<string, any>,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    const secret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'refresh-secret',
    );
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    return this.jwtService.sign(
      payload as Record<string, any>,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const secret = this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'access-secret',
      );
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret,
      });
      return payload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const secret = this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'refresh-secret',
      );
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret,
      });
      return payload;
    } catch (error) {
      return null;
    }
  }

  generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
