import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Address } from '../../address/entity/address.entity';
import { OrderState } from '../../order/types/order.state';
import type { OrderItem } from '../../order-item/entities/order-item.entity';
import { SerializedOrderItem } from '../../order-item/types/serialized-order-item.class';
import { AttributeObject } from '../../product/type/attributeObject.type';
import type { Delivery } from '../entities/delivery.entity';

export class SerializedDelivery {
  @ApiProperty({
    type: [SerializedOrderItem],
  })
  @Transform(({ value }) => value.map((item: OrderItem) => new SerializedOrderItem(item)))
  orderItems: OrderItem[];

  @ApiPropertyOptional({
    example: { paymentMode: 'cashOnDelivery', time: '1:00 pm', day: '12/08/2023' },
  })
  details: AttributeObject<Record<string, unknown>>;

  @ApiProperty({
    example: 20.5,
  })
  charges: number;

  @ApiProperty({
    example: 'pending',
  })
  status: OrderState;

  @ApiProperty({
    description: 'Delivery id.',
    example: '12cba434-1809-4486-91a0-34f467332d12',
  })
  id: string;

  @Exclude()
  address: Address;

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

  constructor(partial: Partial<Delivery>) {
    Object.assign(this, partial);
  }
}
