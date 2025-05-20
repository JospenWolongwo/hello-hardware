export type StoreUserPermission =
  | 'ViewStoreUsers'
  | 'ActivateStoreUser'
  | 'DeactivateStoreUser'
  | 'EditStoreUsersPermission'
  | 'ViewOrderItems';

export const storeUserPermissionValues: StoreUserPermission[] = [
  'ViewStoreUsers',
  'ActivateStoreUser',
  'DeactivateStoreUser',
  'EditStoreUsersPermission',
  'ViewOrderItems',
];
