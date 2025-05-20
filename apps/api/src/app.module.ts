import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ConfigController } from '../src/config/config.controller';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CategoryModule } from './category/category.module';
import { databaseConfig, pinoConfig, redisConfig } from './common/config/index';
import { DeliveryModule } from './delivery/delivery.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { NewsLetterModule } from './news-letter/news-letter.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { QuoteModule } from './quote/quote.module';
import { StockModule } from './stock/stock.module';
import { StoreModule } from './store/store.module';
import { StoreUsersModule } from './store-users/store-users.module';
import { UserModule } from './user-management/user.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { UserReviewsModule } from './user-reviews/user-reviews.module';

@Module({
  imports: [
    CacheModule.registerAsync(redisConfig()),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UserModule,
    LoggerModule.forRoot(pinoConfig()),
    EmailModule,
    AddressModule,
    StoreModule,
    ProductModule,
    CartItemModule,
    CategoryModule,
    UserPermissionsModule,
    StockModule,
    OrderModule,
    DeliveryModule,
    CartItemModule,
    StoreUsersModule,
    UserReviewsModule,
    FilesModule,
    QuoteModule,
    NewsLetterModule,
    ElasticsearchModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {}
