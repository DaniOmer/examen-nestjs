import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UserEntity } from './infrastructure/models/user.model';
import { MovieEntity } from './infrastructure/models/movie.model';
import { DomainExceptionFilter } from './infrastructure/http/filters/domain-exception.filter';
import { JwtAuthGuard } from './infrastructure/http/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/http/guards/roles.guard';
import { TokenService } from './infrastructure/services/token.service';
import { TOKEN_SERVICE } from './application/user/ports/services.ports';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    JwtModule.register({
      global: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'watchlist'),
        entities: [UserEntity, MovieEntity],
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService,
    },
  ],
})
export class AppModule {}
