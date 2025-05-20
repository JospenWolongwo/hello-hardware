import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { UserPermissionsModule } from '../user-permissions/user-permissions.module';
import { StoreUsersController } from './controller/store-users.controller';
import { StoreUser } from './entity/store-user.entity';
import { StoreUsersService } from './service/store-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreUser]), JwtModule.register({}), EmailModule, UserPermissionsModule],
  providers: [StoreUsersService],
  controllers: [StoreUsersController],
  exports: [StoreUsersService],
})
export class StoreUsersModule {}
