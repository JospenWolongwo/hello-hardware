import { faker } from '@faker-js/faker/locale/yo_NG';
import type { Factory, Seeder } from 'typeorm-seeding';
import { Address } from '../../address/entity/address.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';

export default class CreateUserAccounts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const users = await factory(UserEntity)()
      .map(async (user) => {
        user.auth = await factory(Auth)().create({
          email: faker.internet.email({ firstName: user.firstName, lastName: user.lastName }).toLocaleLowerCase(),
          password: 'A' + user.firstName + '@237',
        });

        return user;
      })
      .createMany(3, {
        permissions: await factory(UserPermissionEntity)().make(),
      });

    for (const user of users) {
      await factory(Address)().create({
        owner: user.id,
      });
    }
  }
}
