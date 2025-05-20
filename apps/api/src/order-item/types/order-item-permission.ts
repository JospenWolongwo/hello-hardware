export type OrderItemPermission =
  | 'EditOrderItem'
  | 'EditOrderItemPermission'
  | 'ViewAllOrderItems'
  | 'CancelOrderItem'
  | 'DeclineOrderItem'
  | 'ChangeOrderDelivery';

export const orderItemPermissionValues: OrderItemPermission[] = [
  'EditOrderItem',
  'EditOrderItemPermission',
  'ViewAllOrderItems',
  'CancelOrderItem',
  'DeclineOrderItem',
  'ChangeOrderDelivery',
];
