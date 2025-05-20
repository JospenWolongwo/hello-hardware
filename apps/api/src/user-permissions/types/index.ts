import type { CategoryPermission } from '../../category/types/category-permission.type';
import { categoryPermissionValues } from '../../category/types/category-permission.type';
import type { DeliveryPermission } from '../../delivery/types/delivery.permission';
import { deliveryPermissionValues } from '../../delivery/types/delivery.permission';
import type { OrderPermission } from '../../order/types/order-permission';
import { orderPermissionValues } from '../../order/types/order-permission';
import type { OrderItemPermission } from '../../order-item/types/order-item-permission';
import { orderItemPermissionValues } from '../../order-item/types/order-item-permission';
import type { ProductPermission } from '../../product/type/productPermissions.type';
import { productPermissionValues } from '../../product/type/productPermissions.type';
import type { StockPermission } from '../../stock/types/stockPermissions.type';
import { stockPermissionValues } from '../../stock/types/stockPermissions.type';
import type { StorePermission } from '../../store/type/store-permission.type';
import { storePermissionValues } from '../../store/type/store-permission.type';
import type { StoreUserPermission } from '../../store-users/types/store-user-permissions';
import { storeUserPermissionValues } from '../../store-users/types/store-user-permissions';
import type { UserPermission } from '../../user-management/types/user-permission.type';
import { UserPermissionValues } from '../../user-management/types/user-permission.type';

export type Permission =
  | UserPermission
  | ProductPermission
  | StoreUserPermission
  | StorePermission
  | StockPermission
  | OrderItemPermission
  | OrderPermission
  | DeliveryPermission
  | CategoryPermission;
export const PermissionValues = <Permission[]>[
  ...UserPermissionValues,
  ...productPermissionValues,
  ...storeUserPermissionValues,
  ...storePermissionValues,
  ...stockPermissionValues,
  ...orderPermissionValues,
  ...orderItemPermissionValues,
  ...deliveryPermissionValues,
];
export const AdminPermissions = <Permission[]>[
  ...UserPermissionValues,
  ...productPermissionValues,
  ...storeUserPermissionValues,
  ...storePermissionValues,
  ...stockPermissionValues,
  ...orderPermissionValues,
  ...orderItemPermissionValues,
  ...deliveryPermissionValues,
  ...categoryPermissionValues,
];
export const userPermissions = <Permission[]>[
  'ViewProducts',
  'ViewProduct',
  'ReadUsers',
  'CancelOrderItem',
  'DeclineOrderItem',
];
