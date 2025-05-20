import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Address } from '../../address/entity/address.entity';
import { SerializedAddressEntity } from '../../address/types/serializedAddressEntity.class';
import type { OrderItem } from '../../order-item/entities/order-item.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { Order } from '../entities/order.entity';
import { OrderState, orderStates } from './order.state';

export class SerializedOrder {
  @ApiProperty({
    example: '10',
    description: 'order number',
  })
  number: number;

  @ApiPropertyOptional({
    example: 2,
  })
  taxPercentage: number;

  @ApiPropertyOptional({
    example: "Special packaging for Mother's Day",
  })
  remarks: string;

  @ApiProperty({
    example: 'active',
    enum: orderStates,
  })
  status: OrderState;

  @ApiProperty({
    example: 'e2039fe0-93b3-4702-a24c-3964ed6e7f29',
  })
  id: string;

  @ApiProperty({
    example: 200,
    description: 'Total price of items',
  })
  @Expose()
  get totalItemsPrice(): number {
    return this.orderItems
      .map((orderItem) => this.totalPrice(orderItem))
      .reduce((previous, current) => previous + current);
  }

  @ApiProperty({
    example: 4,
    description: 'Tax price',
  })
  @Expose()
  get taxPrice() {
    return this.taxPercentage ? (this.totalItemsPrice * this.taxPercentage) / 100 : 0;
  }

  @ApiPropertyOptional({
    type: SerializedAddressEntity,
  })
  @Transform(({ value }) => new SerializedAddressEntity(value))
  deliveryAddress: Address;

  @Exclude()
  orderItems: OrderItem[];

  @Exclude()
  user: UserEntity;

  @ApiProperty({
    example: '11/10/2016, 11:49:36 AM',
  })
  @Transform(({ value }) => value.toLocaleString())
  createdAt: Date;

  @ApiProperty({
    example: '10/06/2018, 07:09:00 AM',
  })
  @Transform(({ value }) => value.toLocaleString())
  updatedAt: Date;

  private totalPrice(item: OrderItem) {
    return item.discountPercentage
      ? item.price * item.quantity
      : item.price * item.quantity - item.price * item.quantity * (item.discountPercentage / 100);
  }

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
