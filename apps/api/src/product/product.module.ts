import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { StoreUsersModule } from '../store-users/store-users.module';
import { UserModule } from '../user-management/user.module';
import { ProductController } from './controller/product.controller';
import { Product } from './entity/product.entity';
import { ProductService } from './service/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule, CategoryModule, StoreUsersModule, ElasticsearchModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
