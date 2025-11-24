import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfigsService } from './auth-configs.service';
import { AuthConfigsController } from './auth-configs.controller';
import { AuthConfig } from './entities/auth-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthConfig])],
  controllers: [AuthConfigsController],
  providers: [AuthConfigsService],
  exports: [AuthConfigsService],
})
export class AuthConfigsModule {}
