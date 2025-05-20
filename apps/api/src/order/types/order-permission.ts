export type OrderPermission =
  | 'ViewOrders'
  | 'ViewOrder'
  | 'CreateOrder'
  | 'EditOrder'
  | 'CancelOrder'
  | 'ChangeOrder'
  | 'EditOrderPermission';

export const orderPermissionValues: OrderPermission[] = [
  'CreateOrder',
  'EditOrder',
  'CancelOrder',
  'ChangeOrder',
  'EditOrderPermission',
];
