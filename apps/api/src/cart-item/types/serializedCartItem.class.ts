import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SerializedUser } from '../../user-management/types/serialized-user.class';
import { Stock } from '../../stock/entity/stock.entity';
import { SerializedStock } from '../../stock/types/serialized-stock.class';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { CartItem } from '../entities/cart-item.entity';

export class SerializedCartItem {
  @ApiProperty({
    type: SerializedStock,
  })
  @Transform(({ value }) => new SerializedStock(value))
  stockItem: Stock;

  @ApiProperty({
    type: SerializedUser,
  })
  @Transform(({ value }) => new SerializedUser(value))
  user: UserEntity;

  @ApiProperty({
    example: 4,
    description: 'Quantity of product stock added to cart',
  })
  quantity: number;

  constructor(partial: Partial<CartItem>) {
    Object.assign(this, partial);
  }
}
