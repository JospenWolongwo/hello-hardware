import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { QuoteItem } from './quote-item.quantity.entity';

@Entity()
export class Quote extends BaseEntity {
  @Column()
  email: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column()
  totalItems: number;
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @OneToMany(() => QuoteItem, (quoteItem) => quoteItem.quote, { cascade: true })
  items: QuoteItem[];
}
