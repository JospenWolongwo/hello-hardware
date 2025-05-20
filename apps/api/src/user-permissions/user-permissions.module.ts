import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user-management/user.module';
import { UserPermissionsController } from './controller/user-permissions.controller';
import { UserPermissionEntity } from './entities/user-permission.entity';
import { UserPermissionsService } from './service/user-permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermissionEntity]), UserModule],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
  exports: [UserPermissionsService],
})
export class UserPermissionsModule {}
