import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './controller/permission.controller';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './service/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class PermissionModule {}
