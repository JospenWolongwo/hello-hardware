import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { SerializedStock } from '../../stock/types/serialized-stock.class';
import { SerializedAddressEntity } from '../../address/types/serializedAddressEntity.class';
import { Order } from '../../order/entities/order.entity';
import { orderStates } from '../../order/types/order.state';
import { Stock } from '../../stock/entity/stock.entity';
import type { OrderItem } from '../entities/order-item.entity';

export class SerializedOrderItem {
  @ApiProperty({
    description: 'Stock information',
    type: SerializedStock,
    name: 'stock',
  })
  @Expose({ name: 'stock' })
  get stockInformation() {
    return new SerializedStock(this.stock);
  }

  @ApiProperty({
    description: 'Product ordered quantity',
    example: 50,
  })
  quantity: number;

  @ApiProperty({
    description: 'Product unit',
    example: 'Wallet of 8',
  })
  unit: string;

  @ApiProperty({
    description: 'Product price in $',
    example: 7.07,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'discount percentage allowed',
    example: 15,
  })
  discountPercentage: number;

  @ApiProperty({
    example: 'e2039fe0-93b3-4702-a24c-3964ed6e7f29',
  })
  @Expose({ name: 'orderId' })
  get orderId() {
    return this.order.id;
  }

  @ApiProperty({
    type: SerializedAddressEntity,
  })
  @Expose({ name: 'deliveryAddress' })
  get orderDeliveryAddress() {
    return new SerializedAddressEntity(this.order.deliveryAddress);
  }

  @ApiProperty({
    example: 'active',
    enum: orderStates,
  })
  @Expose({ name: 'orderStatus', groups: ['store-users'] })
  get orderStatus() {
    return this.order.status;
  }

  @Exclude()
  id: string;

  @Exclude()
  order: Order;

  @Exclude()
  stock: Stock;

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

  constructor(partial: Partial<OrderItem>) {
    Object.assign(this, partial);
  }
}
