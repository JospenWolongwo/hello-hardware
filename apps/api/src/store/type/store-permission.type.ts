export type StorePermission =
  | 'EditStore'
  | 'CreateBranch'
  | 'ViewBranch'
  | 'ViewStore'
  | 'InviteUserToStore'
  | 'EditStorePermission';

export const storePermissionValues: StorePermission[] = [
  'EditStore',
  'CreateBranch',
  'ViewBranch',
  'ViewStore',
  'InviteUserToStore',
  'EditStorePermission',
];
