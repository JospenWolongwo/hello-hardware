import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Address } from '../../address/entity/address.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { AttributeObject } from '../../product/type/attributeObject.type';
import { DeliveryState, deliveryStates } from '../types/delivery.state';

@Entity({ name: 'delivery' })
export class Delivery extends BaseEntity {
  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column('simple-json', { nullable: true })
  details: AttributeObject<Record<string, unknown>>;

  @Column({ type: 'decimal', default: 0 })
  charges: number;

  @Column({ type: 'enum', enum: deliveryStates, default: 'pending' })
  status: DeliveryState;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.delivery, { nullable: true, eager: true })
  orderItems: OrderItem[];
}
