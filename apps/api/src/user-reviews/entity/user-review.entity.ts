import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserEntity } from '../../user-management/entities/user.entity';

@Entity({ name: 'user_review' })
export class UserReview extends BaseEntity {
  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'int', default: 0 })
  helpful: number;

  @Column({ type: 'int', default: 0 })
  notHelpful: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => UserEntity, (user) => user.reviews, { eager: true, cascade: true })
  user: UserEntity;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => Stock, (stock) => stock.reviews)
  stock: Stock;
}
