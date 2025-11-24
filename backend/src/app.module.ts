import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { AuthConfigsModule } from './auth-configs/auth-configs.module';
import { ExecutionModule } from './execution/execution.module';
import { LogsModule } from './logs/logs.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DATABASE_LOGGING', false),
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: true,
        ssl: configService.get('DATABASE_SSL') === 'true' ? {
          rejectUnauthorized: false,
        } : false,
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    CommonModule,
    AuthModule,
    UsersModule,
    WorkflowsModule,
    AuthConfigsModule,
    ExecutionModule,
    LogsModule,
  ],
})
export class AppModule {}
