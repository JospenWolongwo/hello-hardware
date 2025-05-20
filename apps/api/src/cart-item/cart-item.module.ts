import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from '../stock/stock.module';
import { UserModule } from '../user-management/user.module';
import { CartItemController } from './controller/cart-item.controller';
import { CartItem } from './entities/cart-item.entity';
import { CartItemService } from './service/cart-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), UserModule, StockModule],
  providers: [CartItemService],
  controllers: [CartItemController],
  exports: [CartItemService],
})
export class CartItemModule {}
