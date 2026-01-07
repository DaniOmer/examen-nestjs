import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus, UserRole } from 'src/domain/user/entities/user.entity';
import { MovieEntity } from './movie.model';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @Column({
    name: 'email_verification_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  emailVerificationToken: string | null;

  @Column({
    name: 'email_verified_at',
    type: 'timestamp',
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @Column({
    name: 'two_factor_code',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  twoFactorCode: string | null;

  @Column({
    name: 'two_factor_expires_at',
    type: 'timestamp',
    nullable: true,
  })
  twoFactorExpiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => MovieEntity, (movie) => movie.user)
  movies: MovieEntity[];
}
