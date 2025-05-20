import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import type { Permission } from '../types';
import { PermissionValues } from '../types';

export class CreateUserPermissionDto {
  @ApiPropertyOptional({
    example: ['UpdateUser', 'CreateCategory'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsNotEmpty()
  @IsIn(PermissionValues, { each: true })
  permissions: Permission[];
}
