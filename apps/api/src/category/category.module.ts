import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreUsersModule } from '../store-users/store-users.module';
import { CategoryController } from './controller/category.controller';
import { Category } from './entities/category.entity';
import { CategoryService } from './service/category.service';

@Module({
  controllers: [CategoryController],
  imports: [TypeOrmModule.forFeature([Category]), StoreUsersModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
