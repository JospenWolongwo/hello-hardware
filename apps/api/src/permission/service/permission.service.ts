import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../dto/permission.dto';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>
  ) {}

  private readonly logger = new Logger(PermissionService.name);

  async create(createPermissionDto: CreatePermissionDto) {
    const isPermissionExisting = await this.findByName(createPermissionDto.name);

    if (isPermissionExisting?.name) {
      // permission name is already taken
      const error = new HttpException(
        `Invalid input. The permission name ${isPermissionExisting.name} is already taken`,
        HttpStatus.BAD_REQUEST
      );
      this.logger.error(`${JSON.stringify(error)}`);

      throw error;
    }

    const prm = Permission.initialize(createPermissionDto);
    const newPermission = this.permissionRepository.create(prm);

    return this.permissionRepository.save(newPermission);
  }

  async findByName(name: string): Promise<PermissionEntity | null> {
    return await this.permissionRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async findAll() {
    const permissions = await this.permissionRepository.find();

    if (Array.isArray(permissions)) {
      return permissions;
    }
    const error = new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    this.logger.error(`${JSON.stringify(error)}`);
    throw error;
  }

  async findById(id: string): Promise<PermissionEntity | null> {
    return await this.permissionRepository
      .findOne({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        this.logger.error(
          `Failed to findPermissionById with the id ${id} \n
          data : ${JSON.stringify(error)}`
        );

        throw new HttpException('Permission was not found.', HttpStatus.NOT_FOUND);
      });
  }

  async update(id: string, updatePermissionDto: Partial<CreatePermissionDto>) {
    const initialPermission = await this.findById(id);

    if (initialPermission) {
      if (updatePermissionDto?.name) {
        const findByName = await this.findByName(updatePermissionDto.name);
        if (findByName) {
          // if a permission with the same name already exist throw an error
          const error = new HttpException(
            `Invalid input. The name ${updatePermissionDto.name} is already taken.`,
            HttpStatus.BAD_REQUEST
          );
          this.logger.error(`${JSON.stringify(error)}`);
          throw error;
        }
      }
      // check if permission to be updated has a description when the initial permission is empty, if not throw an error
      if (!initialPermission?.description && !updatePermissionDto?.description) {
        const error = new HttpException('Invalid input. A description needs to be added.', HttpStatus.BAD_REQUEST);
        this.logger.error(`Invalid input. A description needs to be added. \n data : ${JSON.stringify(error)}`);
        throw error;
      }

      await this.permissionRepository.update(id, updatePermissionDto);

      return this.findById(id);
    }

    //a permission with this Id does not exist
    const error = new HttpException(`A permission with the ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    this.logger.error(`${JSON.stringify(error)}`);
    throw error;
  }
}
