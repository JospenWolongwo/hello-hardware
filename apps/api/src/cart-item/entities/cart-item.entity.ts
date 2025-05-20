import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserEntity } from '../../user-management/entities/user.entity';

@Entity({ name: 'cart_item' })
export class CartItem extends BaseEntity {
  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stockItem: Stock;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'int' })
  quantity: number;
}
