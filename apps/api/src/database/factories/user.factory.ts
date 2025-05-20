import { faker } from '@faker-js/faker/locale/yo_NG';
import type { PhoneNumberDto } from '../../user-management/dto';
import { define } from 'typeorm-seeding';
import { UserEntity } from '../../user-management/entities/user.entity';

define(UserEntity, () => {
  const gender = faker.person.sexType();
  const firstName = faker.person.firstName(gender).toLocaleLowerCase();
  const lastName = faker.person.lastName(gender).toLocaleLowerCase();
  const generatedNumber = faker.helpers.fromRegExp('6[795286][5-9][3-7][0-9]{5}');
  const phoneNumber: PhoneNumberDto = {
    number: generatedNumber,
    countryCode: '+237',
    type: 'mobile',
  };
  const user = new UserEntity();

  user.firstName = firstName;
  user.lastName = lastName;
  user.gender = gender;
  user.phoneNumber = phoneNumber;

  return user;
});
