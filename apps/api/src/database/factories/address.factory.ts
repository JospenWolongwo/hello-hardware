import { faker } from '@faker-js/faker/locale/yo_NG';
import { define } from 'typeorm-seeding';
import { Address } from '../../address/entity/address.entity';

define(Address, () => {
  const country = faker.location.country();
  const city = faker.location.city();
  const zipCode = faker.location.zipCode();
  const street = faker.location.street();

  const address = new Address();
  address.country = country;
  address.city = city;
  address.zipCode = zipCode;
  address.street = street;
  address.additionalDescription = faker.lorem.sentence();

  return address;
});
