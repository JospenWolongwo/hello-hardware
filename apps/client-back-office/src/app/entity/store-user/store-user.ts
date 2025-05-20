import type { BaseEntity } from '../../shared/interfaces/base-entity';

export interface StoreUser extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  store: string;
  phoneNumber: string;
  enabled: boolean;
  permissions: string[];
}
