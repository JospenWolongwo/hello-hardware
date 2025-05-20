import { faker } from '@faker-js/faker/locale/yo_NG';
import { define } from 'typeorm-seeding';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';
import { AdminPermissions, userPermissions } from '../../user-permissions/types';

define(UserPermissionEntity, () => {
  const permission = new UserPermissionEntity();
  const condition = faker.number.int({ min: 0, max: 10 }) > 5;
  permission.permissions = condition ? AdminPermissions : userPermissions;

  return permission;
});
