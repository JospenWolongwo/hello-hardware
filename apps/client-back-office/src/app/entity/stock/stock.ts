import { BaseEntity } from '../../shared/interfaces/base-entity';
import { Product } from '../product/product';

export interface Stock extends BaseEntity {
  product: Product;
  keepingUnit: string;
  price: number;
  quantity: number;
}
