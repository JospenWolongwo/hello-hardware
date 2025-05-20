import { ApiProperty } from '@nestjs/swagger';
import type { CreatePermissionDto } from './create-permission.dto';

export class Permission {
  @ApiProperty({
    example: 'product:create',
  })
  name: string;

  @ApiProperty({
    example: 'access to create a product',
  })
  description: string;

  static initialize(permission: CreatePermissionDto): Permission {
    const prm = new Permission();
    prm.name = permission.name?.toLocaleLowerCase();
    prm.description = permission?.description;

    return prm;
  }
}
