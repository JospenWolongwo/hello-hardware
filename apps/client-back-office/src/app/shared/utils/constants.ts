export const dialogFormConfig = {
  minHeight: '420px',
  minWidth: '400px',
  panelClass: 'form-container',
};

export const viewModalConfig = {
  minHeight: '420px',
  minWidth: '42px',
  maxWidth: '500px',
};

export const successModalConfig = {
  minWidth: '300px',
  maxWidth: '500px',
  ariaLabel: $localize`:Successful operation@@successModal:Successful Operation`,
};

export const confirmationModalConfig = {
  minWidth: '300px',
  ariaLabel: $localize`:Confirm the operation@@confirmationModal:Confirm operation`,
  disableClose: true,
};

export const PERMISSIONS = {
  PRODUCT: ['ViewProducts', 'CreateProduct', 'EditProduct', 'ViewProduct'],
  'STORE-USER': [
    'ViewStoreUsers',
    'AddPermissions',
    'RevokePermissions',
    'ActivateStoreUser',
    'DeactivateStoreUser',
    'EditStoreUsersPermission',
    'ViewOrderItems',
  ],
  STORE: ['EditStore', 'CreateBranch', 'ViewBranch', 'ViewStore', 'InviteUserToStore', 'EditStorePermission'],
  STOCK: ['CreateStock', 'ChangeStockQuantity', 'UpdateStock', 'ViewStock'],
  'ORDER-ITEM': ['EditOrderItem', 'EditOrderItemPermission', 'ViewAllOrderItems'],
  DELIVERY: ['CreateDelivery', 'ViewDeliveries', 'ChangeDeliveryStatus', 'EditDeliveryPermission'],
};
