import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { StoreUsersModule } from '../store-users/store-users.module';
import { UserModule } from '../user-management/user.module';
import { OrderController } from './controller/order.controller';
import { Order } from './entities/order.entity';
import { OrderService } from './service/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    OrderItemModule,
    AddressModule,
    DeliveryModule,
    StoreUsersModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
