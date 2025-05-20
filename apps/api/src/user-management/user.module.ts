import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../files/files.module';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FilesModule],
  controllers: [UserController],
  providers: [UserService, ValidationPipe],
  exports: [UserService],
})
export class UserModule {}
