import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '../address/address.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { DeliveryController } from './controller/delivery.controller';
import { Delivery } from './entities/delivery.entity';
import { DeliveryService } from './service/delivery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), AddressModule, OrderItemModule],
  providers: [DeliveryService],
  controllers: [DeliveryController],
  exports: [DeliveryService],
})
export class DeliveryModule {}
