import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user-management/user.module';
import { ProductModule } from '../product/product.module';
import { StoreUsersModule } from '../store-users/store-users.module';
import { StockController } from './controller/stock.controller';
import { Stock } from './entity/stock.entity';
import { PdfService } from './service/pdf.service';
import { StockService } from './service/stock.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), StoreUsersModule, ProductModule, UserModule],
  providers: [StockService, PdfService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
