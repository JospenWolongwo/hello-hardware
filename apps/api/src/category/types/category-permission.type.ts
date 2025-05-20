export type CategoryPermission =
  | 'EditCategory'
  | 'CreateCategory'
  | 'CreateSubCategory'
  | 'DeleteCategory'
  | 'EditCategoryPermission';

export const categoryPermissionValues: CategoryPermission[] = [
  'EditCategory',
  'CreateCategory',
  'CreateSubCategory',
  'DeleteCategory',
];
