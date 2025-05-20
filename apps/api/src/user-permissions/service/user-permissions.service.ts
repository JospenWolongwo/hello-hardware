import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import type { CreateUserPermissionDto } from '../dto/create-user-permission.dto';
import { UserPermissionEntity } from '../entities/user-permission.entity';
import type { Permission } from '../types';
import { SerializedUserPermissions } from '../types/serializedUserPermissions.class';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private readonly logger = new Logger(UserPermissionsService.name);

  async addPermissions(id: string, createUserPermissionDto: CreateUserPermissionDto) {
    //delete saved account information in cache
    this.cacheManager.del(id);

    const userPermission = await this.userPermissionRepository.findOne({
      where: {
        owner: {
          id: id,
        },
      },
    });

    if (userPermission?.id) {
      if (userPermission.permissions?.length) {
        const actualPermissions = userPermission.permissions;

        if (createUserPermissionDto.permissions.some((permission) => !actualPermissions.includes(permission))) {
          const newPermissions = this.merge(actualPermissions, createUserPermissionDto.permissions);

          await this.userPermissionRepository.update(userPermission.id, {
            permissions: newPermissions,
          });
        }
      } else {
        await this.userPermissionRepository.update(userPermission.id, {
          permissions: createUserPermissionDto.permissions,
        });
      }

      const updatedUserPermissions = await this.userPermissionRepository.findOne({ where: { owner: { id: id } } });

      return new SerializedUserPermissions(<UserPermissionEntity>updatedUserPermissions);
    } else {
      const error = new HttpException(`Permission does not exist.`, HttpStatus.BAD_REQUEST);
      this.logger.error(
        {
          function: 'addPermissions',
          input: { createUserPermissionDto: createUserPermissionDto, user_id: id },
          error: error,
        },
        `Permission does not exist.`
      );

      throw error;
    }
  }

  async revokePermissions(id: string, revokePermissionDto: CreateUserPermissionDto) {
    //delete saved account information in cache
    this.cacheManager.del(id);

    const userPermission = await this.userPermissionRepository.findOne({
      where: {
        owner: {
          id: id,
        },
      },
    });

    if (userPermission?.id) {
      const actualPermissions = userPermission.permissions;

      if (actualPermissions?.length) {
        const permissionsToRevoke = revokePermissionDto.permissions;

        permissionsToRevoke.forEach((permission) => {
          if (!actualPermissions.includes(permission)) {
            const error = new HttpException(`Invalid input ${permission}.`, HttpStatus.BAD_REQUEST);
            this.logger.error(
              { function: 'revoke', input: { revokePermissionDto: revokePermissionDto, user_id: id }, error: error },
              `Invalid input.`
            );

            throw error;
          } else {
            const index = actualPermissions.indexOf(permission);

            if (index !== -1) {
              actualPermissions.splice(index, 1);
            }
          }
        });

        await this.userPermissionRepository.update(userPermission.id, {
          permissions: actualPermissions,
        });

        const updatedUserPermissions = await this.userPermissionRepository.findOne({ where: { owner: { id: id } } });

        return new SerializedUserPermissions(<UserPermissionEntity>updatedUserPermissions);
      }

      const error = new HttpException(`User has no permissions.`, HttpStatus.BAD_REQUEST);
      this.logger.error(
        {
          function: 'revokePermissions',
          input: { revokePermissionDto: revokePermissionDto, user_id: id },
          error: error,
        },
        `User with empty permissions.`
      );

      throw error;
    }

    const error = new HttpException(`Permission does not exist.`, HttpStatus.BAD_REQUEST);
    this.logger.error(
      { function: 'revokePermissions', input: { revokePermissionDto: revokePermissionDto, user_id: id }, error: error },
      `Permission does not exist.`
    );

    throw error;
  }

  private merge(arr1: Permission[], arr2: Permission[]) {
    const newArr: Permission[] = [...arr1];

    for (let i = 0; i < arr2.length; i++) {
      const item = arr2[i];

      if (newArr.includes(item)) {
        continue;
      } else {
        newArr.push(item);
      }
    }

    return newArr;
  }
}
