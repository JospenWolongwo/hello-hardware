import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { Quote } from './quote.entity';

@Entity()
export class QuoteItem extends BaseEntity {
  @ManyToOne(() => Quote, (quote) => quote.items, { onDelete: 'CASCADE' })
  quote: Quote;

  @ManyToOne(() => Stock, { eager: true })
  stock: Stock;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
