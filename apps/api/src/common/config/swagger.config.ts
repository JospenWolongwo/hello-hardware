import type { SwaggerDocumentOptions } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { NewsLetterModule } from '../../news-letter/news-letter.module';
import { AddressModule } from '../../address/address.module';
import { CartItemModule } from '../../cart-item/cart-item.module';
import { CategoryModule } from '../../category/category.module';
import { DeliveryModule } from '../../delivery/delivery.module';
import { FilesModule } from '../../files/files.module';
import { OrderModule } from '../../order/order.module';
import { ProductModule } from '../../product/product.module';
import { QuoteModule } from '../../quote/quote.module';
import { StockModule } from '../../stock/stock.module';
import { StoreModule } from '../../store/store.module';
import { UserModule } from '../../user-management/user.module';
import { UserPermissionsModule } from '../../user-permissions/user-permissions.module';
import { UserReviewsModule } from '../../user-reviews/user-reviews.module';
export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Hello hardware API')
  .setVersion('1.0')
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  include: [
    UserModule,
    AddressModule,
    StoreModule,
    ProductModule,
    CategoryModule,
    StockModule,
    CartItemModule,
    OrderModule,
    DeliveryModule,
    UserPermissionsModule,
    UserReviewsModule,
    FilesModule,
    QuoteModule,
    NewsLetterModule,
  ],
  deepScanRoutes: true,
};
