import type { BaseEntity } from '../../shared/interfaces/base-entity';

export interface ProductCategory extends BaseEntity {
  description: string;
  name: string;
  parent: string | null;
  subCategories: string[];
}
