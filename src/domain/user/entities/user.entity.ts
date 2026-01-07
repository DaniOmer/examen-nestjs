export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  status: UserStatus;
  role: UserRole;
  emailVerificationToken: string | null;
  emailVerifiedAt: Date | null;
  twoFactorCode: string | null;
  twoFactorExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(
    props: Omit<
      UserProps,
      | 'createdAt'
      | 'updatedAt'
      | 'emailVerifiedAt'
      | 'twoFactorCode'
      | 'twoFactorExpiresAt'
    >,
  ): User {
    const now = new Date();
    return new User({
      ...props,
      emailVerifiedAt: null,
      twoFactorCode: null,
      twoFactorExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get phoneNumber(): string | null {
    return this.props.phoneNumber;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get emailVerificationToken(): string | null {
    return this.props.emailVerificationToken;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  get twoFactorCode(): string | null {
    return this.props.twoFactorCode;
  }

  get twoFactorExpiresAt(): Date | null {
    return this.props.twoFactorExpiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Domain methods
  isPending(): boolean {
    return this.props.status === UserStatus.PENDING;
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  isEmailVerified(): boolean {
    return this.props.emailVerifiedAt !== null;
  }

  verifyEmail(): void {
    this.props.emailVerifiedAt = new Date();
    this.props.emailVerificationToken = null;
    this.props.status = UserStatus.ACTIVE;
    this.touch();
  }

  setEmailVerificationToken(token: string): void {
    this.props.emailVerificationToken = token;
    this.touch();
  }

  setTwoFactorCode(code: string, expiresInMinutes: number = 10): void {
    this.props.twoFactorCode = code;
    this.props.twoFactorExpiresAt = new Date(
      Date.now() + expiresInMinutes * 60 * 1000,
    );
    this.touch();
  }

  clearTwoFactorCode(): void {
    this.props.twoFactorCode = null;
    this.props.twoFactorExpiresAt = null;
    this.touch();
  }

  isTwoFactorCodeValid(code: string): boolean {
    if (!this.props.twoFactorCode || !this.props.twoFactorExpiresAt) {
      return false;
    }

    if (new Date() > this.props.twoFactorExpiresAt) {
      return false;
    }

    return this.props.twoFactorCode === code;
  }

  updatePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
    this.touch();
  }

  suspend(): void {
    this.props.status = UserStatus.SUSPENDED;
    this.touch();
  }

  activate(): void {
    this.props.status = UserStatus.ACTIVE;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}
