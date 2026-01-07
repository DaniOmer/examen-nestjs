import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from 'src/domain/user/repositories/user.repository.interface';
import { User } from 'src/domain/user/entities/user.entity';
import { UserEntity } from '../models/user.model';
import { UserProps } from 'src/domain/user/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.typeOrmRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { emailVerificationToken: token },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.typeOrmRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }

  private toDomain(entity: UserEntity): User {
    const props: UserProps = {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      password: entity.password,
      phoneNumber: entity.phoneNumber,
      status: entity.status,
      role: entity.role,
      emailVerificationToken: entity.emailVerificationToken,
      emailVerifiedAt: entity.emailVerifiedAt,
      twoFactorCode: entity.twoFactorCode,
      twoFactorExpiresAt: entity.twoFactorExpiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return User.reconstitute(props);
  }

  private toEntity(user: User): UserEntity {
    const props = user.toJSON();
    const entity = new UserEntity();
    entity.id = props.id;
    entity.firstName = props.firstName;
    entity.lastName = props.lastName;
    entity.email = props.email;
    entity.password = props.password;
    entity.phoneNumber = props.phoneNumber;
    entity.status = props.status;
    entity.role = props.role;
    entity.emailVerificationToken = props.emailVerificationToken;
    entity.emailVerifiedAt = props.emailVerifiedAt;
    entity.twoFactorCode = props.twoFactorCode;
    entity.twoFactorExpiresAt = props.twoFactorExpiresAt;
    entity.createdAt = props.createdAt;
    entity.updatedAt = props.updatedAt;
    return entity;
  }
}
