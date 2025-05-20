import { define } from 'typeorm-seeding';
import { StoreUser } from '../../store-users/entity/store-user.entity';

define(StoreUser, () => {
  const storeUser = new StoreUser();

  return storeUser;
});
