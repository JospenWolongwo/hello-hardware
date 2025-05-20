import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from '../stock/stock.module';
import { StoreUsersModule } from '../store-users/store-users.module';
import { OrderItemController } from './controller/order-item.controller';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemService } from './service/order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), StockModule, StoreUsersModule],
  providers: [OrderItemService],
  exports: [OrderItemService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
