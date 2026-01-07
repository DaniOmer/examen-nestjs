export interface IEmailService {
  sendVerificationEmail(to: string, token: string): Promise<void>;
  sendTwoFactorCode(to: string, code: string): Promise<void>;
}
export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');


export interface IHashingService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
export const HASHING_SERVICE = Symbol('HASHING_SERVICE');


export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): TokenPayload | null;
  generateRandomToken(): string;
  generateTwoFactorCode(): string;
}
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}
export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');


export interface IIdGenerator {
  generate(): string;
}
export const ID_GENERATOR = Symbol('ID_GENERATOR');

