import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';
import { Order } from '../../order/entities/order.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { OrderItemState, orderItemStates } from '../types/order-item.state';

@Entity({ name: 'order_item' })
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Stock, { eager: true })
  @JoinColumn({ name: 'stock_id' })
  productStock: Stock;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ name: 'discount_percentage', type: 'decimal', default: 0 })
  discountPercentage: number;

  @Column({ type: 'enum', enum: orderItemStates, default: 'pending' })
  status: OrderItemState;

  @ManyToOne(() => Delivery, (delivery) => delivery.orderItems, { nullable: true })
  delivery: Delivery;
}
