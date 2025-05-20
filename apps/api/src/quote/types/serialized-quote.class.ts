import { Exclude, Expose, Type } from 'class-transformer';
import { SerializedQuoteItem } from './serialized-quote-item.class';

export class SerializedQuote {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  companyName?: string;

  @Expose()
  totalItems: number;

  @Expose()
  totalPrice: number;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  @Type(() => SerializedQuoteItem)
  items: SerializedQuoteItem[];

  constructor(partial: Partial<SerializedQuote>) {
    Object.assign(this, partial);
  }
}
