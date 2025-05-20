export type DeliveryPermission =
  | 'CreateDelivery'
  | 'ViewDeliveries'
  | 'ChangeDeliveryStatus'
  | 'EditDeliveryPermission';

export const deliveryPermissionValues: DeliveryPermission[] = [
  'CreateDelivery',
  'ViewDeliveries',
  'ChangeDeliveryStatus',
  'EditDeliveryPermission',
];
