/* eslint-disable no-console */
import { faker } from '@faker-js/faker/locale/yo_NG';
import { getRepository } from 'typeorm';
import type { Factory, Seeder } from 'typeorm-seeding';
import { Address } from '../../address/entity/address.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { Store } from '../../store/entities/store.entity';
import { StoreUser } from '../../store-users/entity/store-user.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';
import { AdminPermissions } from '../../user-permissions/types';

export class CreateAdminStore implements Seeder {
  public async run(factory: Factory): Promise<void> {
    // Check if admin already exists
    const authRepository = getRepository(Auth);
    const existingAdminAuth = await authRepository.findOne({
      where: { email: 'jospen.wolongwo@hellocomputing.tech' },
      relations: ['user'],
    });

    let adminUser: UserEntity;

    if (existingAdminAuth) {
      console.log('Admin user already exists, skipping creation');
      adminUser = existingAdminAuth.user;
    } else {
      // Creation of Admin
      adminUser = await factory(UserEntity)().create({
        firstName: 'jospen',
        lastName: 'wolongwo',
        gender: 'male',
        phoneNumber: {
          number: '698805890',
          countryCode: '+237',
          type: 'mobile',
        },
        permissions: await factory(UserPermissionEntity)().make({
          permissions: AdminPermissions,
        }),
        auth: await factory(Auth)().create({
          email: 'jospen.wolongwo@hellocomputing.tech',
          password: 'Hello@123',
        }),
      });
    }

    // Creation of Admin Store
    const storeRepository = getRepository(Store);
    let adminStore = await storeRepository.findOne({ where: { name: 'Hello Hardware' } });

    if (!adminStore) {
      console.log('Creating admin store Hello Hardware');
      // Creation of Admin Store
      adminStore = await factory(Store)()
        .map(async (store) => {
          store.owner = adminUser;

          return store;
        })
        .create({
          name: 'Hello Hardware',
          description: 'Digital Products',
        });

      // Making the Admin a store user of its store
      await factory(StoreUser)()
        .map(async (storeUser) => {
          storeUser.user = adminUser;
          if (adminStore) {
            storeUser.store = adminStore;
          } else {
            throw new Error('Admin store not found');
          }

          return storeUser;
        })
        .create();

      console.log('Creating additional store users');
      // Create store users for the Admin's store
      const storeUsers = await factory(StoreUser)()
        .map(async (storeUser) => {
          // Creation of a new store user
          storeUser.user = await factory(UserEntity)()
            .map(async (user) => {
              user.auth = await factory(Auth)().create({
                email: faker.internet.email({ firstName: user.firstName, lastName: user.lastName }).toLocaleLowerCase(),
                password: 'A' + user.firstName + '@237',
              });

              return user;
            })
            .create({
              permissions: await factory(UserPermissionEntity)().make(),
            });
          await factory(Address)().create({
            country: 'cameroon',
            city: 'douala',
            street: 'orca akwa dubai',
            owner: adminUser.id,
          });
          // Assigning the new store user, the admin's store
          if (adminStore) {
            storeUser.store = adminStore;
          } else {
            throw new Error('Admin store not found');
          }
          // Set the admin as the inviter
          storeUser.inviter = adminUser;

          return storeUser;
        })
        .createMany(3);

      for (const storeUser of storeUsers) {
        await factory(Address)().create({
          owner: storeUser.id,
        });
      }
    } else {
      console.log('Admin store Hello Hardware already exists, skipping creation');
    }
  }
}
