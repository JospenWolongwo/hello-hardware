import type { BaseEntity } from '../../shared/interfaces/base-entity';

export interface Store extends BaseEntity {
  description: string;
  name: string;
  parent: string | null;
  branches: string[];
}
