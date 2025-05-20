import { define } from 'typeorm-seeding';
import { Auth } from '../../auth/entities/auth.entity';

define(Auth, () => {
  const userAccount = new Auth();
  userAccount.active = true;

  return userAccount;
});
