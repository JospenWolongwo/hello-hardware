import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Store } from '../../store/entities/store.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { Permission } from '../../user-permissions/types';
import type { StoreUser } from '../entity/store-user.entity';

export class SerializedStoreUser {
  @ApiProperty({
    example: '0f1835a4-0417-4e8b-ba08-908c23180504',
  })
  @Expose()
  get userId(): string {
    return this.user.id;
  }

  @ApiProperty({
    example: 'joe',
  })
  @Expose()
  get firstName(): string {
    return `${this.user.firstName || ''}`;
  }

  @ApiProperty({
    example: 'stone',
  })
  @Expose()
  get lastName(): string {
    return `${this.user.lastName || ''}`;
  }

  @ApiProperty({
    example: '+237690089678',
  })
  @Expose()
  get phoneNumber(): string {
    return `${this.user.phoneNumber || ''}`;
  }

  @ApiProperty({
    example: 'male',
  })
  @Expose()
  get gender(): string {
    return this.user.gender || '';
  }

  @ApiProperty({
    example: 'joestone@gmail.com',
  })
  @Expose()
  get email(): string {
    return this.user.auth.email;
  }

  @ApiProperty({
    example: true,
  })
  @Expose()
  enabled: boolean;

  @ApiProperty({
    example: ['ReadUsers', 'ReadUser'],
  })
  @Expose()
  get permissions(): Permission[] {
    return this.user.permissions.permissions;
  }

  @ApiProperty({
    example: 'fbb0934a-fcfd-43f1-820b-dcf395814c65',
  })
  id: string;

  @ApiProperty({
    example: 'carrefour',
  })
  @Transform(({ value }) => value.name)
  store: Store;

  @Exclude()
  user: UserEntity;

  @Exclude()
  inviter: UserEntity;

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  createdAt: Date;

  constructor(partial: Partial<StoreUser>) {
    Object.assign(this, partial);
  }
}
