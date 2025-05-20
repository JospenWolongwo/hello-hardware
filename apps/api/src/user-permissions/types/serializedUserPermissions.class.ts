import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { UserPermissionEntity } from '../entities/user-permission.entity';
import type { Permission } from '.';

export class SerializedUserPermissions {
  @ApiProperty({
    example: ['Readusers', 'ReadUser'],
  })
  permissions: Permission[];

  @Exclude()
  id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  owner: UserEntity;

  constructor(partial: Partial<UserPermissionEntity>) {
    Object.assign(this, partial);
  }
}
