import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { StoreUsersModule } from '../store-users/store-users.module';
import { UserModule } from '../user-management/user.module';
import { UserPermissionsModule } from '../user-permissions/user-permissions.module';
import { StoreController } from './controller/store.controller';
import { Store } from './entities/store.entity';
import { StoreService } from './service/store.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    UserModule,
    StoreUsersModule,
    UserPermissionsModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
