import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Address } from '../../address/entity/address.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { OrderState, orderStates } from '../types/order.state';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, eager: true })
  @JoinColumn({ name: 'order_items' })
  orderItems: OrderItem[];

  @Column({ name: 'order_number' })
  @Generated('increment')
  number: number;

  @Column({ name: 'tax_percentage', type: 'decimal', nullable: true })
  taxPercentage: number;

  @Column({ nullable: true })
  remarks: string;

  @Column({ type: 'enum', enum: orderStates, default: 'pending' })
  status: OrderState;

  @OneToOne(() => Address, { eager: true, nullable: true })
  @JoinColumn({ name: 'delivery_address' })
  deliveryAddress: Address;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
