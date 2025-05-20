import type { Permission } from '../../user-permissions/types';

export interface AccountInfo {
  uid: string;
  createdAt: Date;
  lastLogin: Date;
  permissions: Permission[];
}
