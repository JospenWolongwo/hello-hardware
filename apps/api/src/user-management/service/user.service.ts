import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from '../../files/service/file.service';
import { SerializedProduct } from '../../product/type/serializedProduct.class';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';
import type { UpdateUserDto } from '../dto/updateUser.dto';
import { UserEntity } from '../entities/user.entity';
import { SerializedUser } from '../types/serialized-user.class';
import { Express } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService
  ) {}

  private readonly logger = new Logger(UserService.name);
  private readonly picturesStorageUrl = <string>process.env.AZURE_BLOB_STORAGE_URL;

  async create() {
    const newUser = this.userRepository.create();

    const permissions = new UserPermissionEntity();

    newUser.permissions = permissions;

    return newUser;
  }

  async findAll() {
    const users = await this.userRepository.find({ relations: ['auth'] });

    if (Array.isArray(users)) {
      return users.map((user) => new SerializedUser(user));
    }
    const error = new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    this.logger.error({ function: this.findAll.name }, `Failed users.`);

    throw error;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ relations: ['auth'], where: { id: id } }).catch((error) => {
      this.logger.error(
        { function: this.findById.name, input: { id: id }, error: error },

        `Failed to find user with id: ${id}.`
      );
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    });

    if (user) {
      const serializedUser = new SerializedUser(user);
      serializedUser.profilePicture = `${this.picturesStorageUrl}${user.profilePicture}`;

      return serializedUser;
    }

    const error = new HttpException('User was not found', HttpStatus.NOT_FOUND);
    this.logger.error(
      { function: this.findById.name, input: { id: id } },

      `User with id: ${id} was not found.`
    );

    throw error;
  }

  async getById(id: string) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async getFavouriteProducts(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id }, relations: { favouriteProducts: true } });

    if (user) {
      return user.favouriteProducts.map((product) => new SerializedProduct(product));
    }

    const error = new HttpException('User was not found', HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.getFavouriteProducts.name, input: { id: id } },

      `User with id: ${id} was not found.`
    );

    throw error;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { auth: { email: email } } });

    return user;
  }

  async exist(id: string) {
    return await this.userRepository.exist({ where: { id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, profilePictureFile?: Express.Multer['File']) {
    const isUserExisting = await this.findById(id);

    if (!isUserExisting) {
      throw new HttpException(`User with the Id: '${id}' not found.`, HttpStatus.NOT_FOUND);
    }

    if (profilePictureFile) {
      // Upload profile picture to Azure Blob Storage and pass the userId
      const uploadedFile = await this.filesService.uploadFile(
        profilePictureFile,
        'profile-picture',
        undefined,
        undefined,
        id
      );

      // Update the user's profile picture field with the file name
      updateUserDto.profilePicture = uploadedFile.name;
    }

    await this.userRepository.update(id, updateUserDto);

    return this.findById(id);
  }

  isProfileComplete(user: UserEntity): boolean {
    return !!(user.gender && user.phoneNumber && user.firstName && user.lastName);
  }
}
