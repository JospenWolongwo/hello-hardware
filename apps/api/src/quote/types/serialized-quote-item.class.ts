import { Exclude, Expose } from 'class-transformer';

export class SerializedQuoteItem {
  @Expose()
  stockId: string;

  @Expose()
  quantity: number;

  @Expose()
  price: number;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<SerializedQuoteItem>) {
    Object.assign(this, partial);
  }
}
