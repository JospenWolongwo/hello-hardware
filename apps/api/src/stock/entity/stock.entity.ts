import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entity/product.entity';
import { QuoteItem } from '../../quote/entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { UserReview } from '../../user-reviews/entity/user-review.entity';
import { StockAvailability } from '../enum/stock-availability.enum';
import type { Discount } from '../types/discount.type';
import { TimeLapse } from '../types/timeLapse.type';

@Entity({ name: 'stock' })
@Index(['product', 'keepingUnit'], { unique: true })
export class Stock extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.stocks, { eager: true })
  product: Product;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column('simple-json', { nullable: false, default: { weight: 'none' } })
  characteristics: Record<string, string>;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column('simple-json', { nullable: true })
  discounts: Discount[];

  @Column({ name: 'sku' })
  keepingUnit: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column('simple-json', { nullable: true })
  guarantee?: TimeLapse;

  @Column('simple-array')
  pictures: string[];

  @Column('simple-json', { nullable: true })
  description: {
    shortDescription: string | null;
    longDescription: string[] | null;
  } | null;

  @Column('text', { nullable: true })
  manualPdf: string | null;

  @Column({ type: 'enum', enum: StockAvailability, default: StockAvailability.IN_STOCK })
  availabilityStatus: StockAvailability;

  @Column('simple-json', { nullable: true })
  deliveryDuration: TimeLapse | null;

  @OneToMany(() => UserReview, (review) => review.stock, { cascade: true })
  reviews: UserReview[];

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.stock)
  quoteItems: QuoteItem[];

  @ManyToMany(() => UserEntity, (user) => user.favouriteStocks)
  @JoinTable({
    name: 'user_favourite_stocks',
    joinColumn: {
      name: 'stock',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  likedBy: UserEntity[];
}
