import type { BaseEntity } from '../../shared/interfaces/base-entity';
import { SelectEntity } from '../../shared/interfaces/select-entity';

export interface Product extends BaseEntity {
  name: string;
  brand: string;
  gallery: string;
  description: string;
  status: boolean;
  minPrice: number;
  maxPrice: number | null;
  store: SelectEntity;
  category: SelectEntity;
  otherInfo: object | null;
  active: boolean;
  pictures: string[];
  extraAttributes: {
    characteristics: string[];
  };
}
