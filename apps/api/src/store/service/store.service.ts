/* eslint-disable max-lines */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { productPermissionValues } from '../../product/type/productPermissions.type';
import { storeUserPermissionValues } from '../../store-users/types/store-user-permissions';
import { TreeRepository } from 'typeorm';
import type { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { CategoryService } from '../../category/service/category.service';
import { ProductService } from '../../product/service/product.service';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import type { UserEntity } from '../../user-management/entities/user.entity';
import { UserPermissionsService } from '../../user-permissions/service/user-permissions.service';
import type { CreateStoreDto } from '../dto/create-store.dto';
import type { SendInvitationDto } from '../dto/sendInvitation.dto';
import { Store } from '../entities/store.entity';
import type { FlattenStore } from '../type/flatten-store';
import { SerializedFlattenStore } from '../type/serialized-flatten-store.class';
import { SerializedStoreEntity } from '../type/serialized-store-entity.class';
import { storePermissionValues } from '../type/store-permission.type';

@Injectable()
export class StoreService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Store) private readonly storeRepository: TreeRepository<Store>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly storeUsersService: StoreUsersService,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly categoriesService: CategoryService,
    private readonly productService: ProductService
  ) {}

  private readonly logger = new Logger(StoreService.name);

  async create(user: UserEntity, createStoreDto: CreateStoreDto) {
    const store = await this.storeRepository.findOne({ where: { name: createStoreDto.name } });

    if (store?.id) {
      const error = new HttpException(`The store name ${createStoreDto.name} is taken.`, HttpStatus.BAD_REQUEST);

      this.logger.error(
        { function: this.create.name, input: { user: user, createStoreDto: createStoreDto } },
        `The store name : '${createStoreDto.name}' is taken.`
      );

      throw error;
    }

    const newStore = this.createStore(createStoreDto.name, createStoreDto.description, user);

    const createdStore = await this.storeRepository.save(newStore).catch((error) => {
      this.logger.error(
        {
          function: this.create.name,
          input: { user: user, createStoreDto: createStoreDto, error: error },
        },
        `Failed to save a store.`
      );

      throw new HttpException('Internal service error', HttpStatus.INTERNAL_SERVER_ERROR);
    });

    //delete saved account information in cache
    this.cacheManager.del(user.id);

    await this.userPermissionsService.addPermissions(user.id, {
      permissions: [
        ...storePermissionValues,
        ...storeUserPermissionValues,
        'AddPermissions',
        'RevokePermissions',
        ...productPermissionValues,
      ],
    });

    await this.storeUsersService.create(user, createdStore);

    return new SerializedFlattenStore(this.flattenStore(createdStore)[0]);
  }

  async createBranch(store_id: string, user: UserEntity, createStoreDto: CreateStoreDto) {
    const parentStore = await this.storeRepository.findOne({ where: { id: store_id } });

    if (parentStore?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreName(user.id, parentStore.name);

      if (isStoreUser) {
        const storeWithSameName = await this.storeRepository.findOne({
          where: { name: createStoreDto.name, parent: { id: store_id } },
        });

        if (storeWithSameName?.id) {
          const error = new HttpException(`The branch name ${createStoreDto.name} is taken.`, HttpStatus.CONFLICT);

          this.logger.error(
            {
              function: this.createBranch.name,
              input: { store_id: store_id, user: user, createStoreDto: createStoreDto },
            },
            `The branch name : '${createStoreDto.name}' is taken.`
          );

          throw error;
        }

        const newStore = this.createStore(createStoreDto.name, createStoreDto.description, user);

        newStore.parent = parentStore;

        const createdStore = await this.storeRepository.save(newStore).catch((error) => {
          this.logger.error(
            {
              function: this.createBranch.name,
              input: { store_id: store_id, user: user, createStoreDto: createStoreDto, error: error },
            },
            `Failed to save a branch to a store.`
          );

          throw new HttpException('Internal service error', HttpStatus.INTERNAL_SERVER_ERROR);
        });

        await this.storeUsersService.create(user, createdStore);

        return new SerializedFlattenStore(this.flattenStore(createdStore)[0]);
      }

      const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.createBranch.name, input: { store_id: store_id, user: user, createStoreDto: createStoreDto } },
        `Active user with id:'${user.id}' working at the store with id: '${store_id}' is not found.`
      );

      throw error;
    }

    const error = new HttpException(`Parent store with that id does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.createBranch.name, input: { store_id: store_id, user: user, createStoreDto: createStoreDto } },
      `Parent store with id: '${store_id}' does not exist.`
    );

    throw error;
  }

  async findOne(uid: string, id: string) {
    const storeExist = await this.storeRepository.findOne({ where: { id: id } });

    if (storeExist?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

      if (isStoreUser) {
        return new SerializedStoreEntity(storeExist);
      }

      const error = new HttpException(`You are not an active store user of this store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.findOne.name, input: { uid: uid, id: id } },
        `User with id:'${uid}' is not a store user to the store with id: '${id}'.`
      );
      throw error;
    }

    const error = new HttpException(`Store with that id does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.findOne.name, input: { uid: uid, id: id } },
      `Store with id: '${id}' does not exist.`
    );
    throw error;
  }

  async findOneWithBranches(uid: string, id: string) {
    const storeExist = await this.storeRepository.findOne({ where: { id: id } });

    if (storeExist?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

      if (isStoreUser) {
        const storeWithDescendants = await this.storeRepository.findDescendantsTree(storeExist);

        return new SerializedStoreEntity(storeWithDescendants);
      }

      const error = new HttpException(`You are not an active store user of this store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.findOneWithBranches.name, input: { uid: uid, id: id } },
        `Active user with id:'${uid}' is not a store user to the store with id: '${id}'.`
      );
      throw error;
    }

    const error = new HttpException(`Store with that id does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.findOneWithBranches.name, input: { uid: uid, id: id } },
      `Store with id: '${id}' does not exist.`
    );
    throw error;
  }

  async findById(id: string, uid: string) {
    const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

    if (isStoreUser) {
      return await this.storeRepository.findOne({
        where: {
          id: id,
        },
      });
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findById.name, input: { id: id, uid: uid } },
      `Active user with id:'${uid}' working at the store with id: '${id}' is not found.`
    );
    throw error;
  }

  async findByName(name: string, uid: string) {
    const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreName(uid, name);

    if (isStoreUser) {
      return await this.storeRepository.findOne({
        where: {
          name: name,
        },
      });
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findById.name, input: { name: name, uid: uid } },
      `Active user with id:'${uid}' working at the store with name: '${name}' is not found.`
    );
    throw error;
  }

  async findAll(uid: string) {
    const userToStores = await this.storeUsersService.findByUserId(uid);

    if (userToStores.length > 0) {
      const stores = await this.storeRepository.findTrees({ relations: ['owner'] });

      if (Array.isArray(stores)) {
        const filteredStores = stores.filter(
          (store) => store.owner.id === uid || userToStores.some((entry) => entry.store.id === store.id)
        );
        const flattenTree = this.flattenTree(filteredStores);
        const serializedFlattenStores = flattenTree.map((store) => new SerializedFlattenStore(store));

        return serializedFlattenStores;
      }

      const error = new HttpException('Internal service error', HttpStatus.INTERNAL_SERVER_ERROR);

      this.logger.error({ function: this.findAll.name, input: { uid: uid } }, 'Error in finding tree.');

      throw error;
    }

    return [];
  }

  async update(user: UserEntity, id: string, updateStoreDto: Partial<CreateStoreDto>) {
    const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(user.id, id);

    if (isStoreUser) {
      await this.storeRepository.update(id, updateStoreDto).catch((error) => {
        this.logger.error(
          `Failed to update the store with the store id ${id}\n
          data : ${JSON.stringify(error)}`
        );
        throw new HttpException('Internal service error', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      const updatedStore = <Store>await this.findOne(user.id, id);

      return new SerializedFlattenStore(this.flattenStore(updatedStore)[0]);
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.update.name, input: { user: user, id: id, updateStoreDto: updateStoreDto } },
      `User with id:'${user.id}' is not an active store user to the store with id: '${id}'.`
    );
    throw error;
  }

  async inviteUserToStore(uid: string, sendInvitationDto: SendInvitationDto) {
    const existingStore = await this.findByName(sendInvitationDto.store, uid);

    if (existingStore?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, existingStore.id);

      if (isStoreUser) {
        const storeUserExist = await this.storeUsersService.existByEmail(sendInvitationDto.email, existingStore.id);

        if (storeUserExist) {
          this.logger.error(
            {
              function: 'sendInvitationEmail',
              input: { uid: uid, sendInvitationDto: sendInvitationDto },
            },
            `The user with email: '${sendInvitationDto.email}', is already assign to the store with name: ${sendInvitationDto.store}`
          );

          throw new HttpException(
            `The user with email: '${sendInvitationDto.email}', is already assign to the store with name: ${sendInvitationDto.store}`,
            HttpStatus.CONFLICT
          );
        }

        await this.storeUsersService.sendInvitationEmail(uid, existingStore.id, sendInvitationDto.email);

        return {
          statusCode: HttpStatus.ACCEPTED,
          message: `Invitation to the ${sendInvitationDto.store} store was successfully send to: ${sendInvitationDto.email}`,
        };
      } else {
        const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

        this.logger.error(
          { function: this.update.name, input: { uid: uid, sendInvitationDto: sendInvitationDto } },
          `User with id:'${uid}' is not an active store user to the store with name: '${sendInvitationDto.store}'.`
        );
        throw error;
      }
    }
    this.logger.error(
      {
        function: 'sendInvitationEmail',
        input: { uid: uid, sendInvitationDto: sendInvitationDto },
      },
      `The store with name: '${sendInvitationDto.store}', belonging to user with id: '${uid}' does not exist.`
    );

    throw new HttpException(
      `The store with name: '${sendInvitationDto.store}', belonging to you does not exist.`,
      HttpStatus.BAD_REQUEST
    );
  }

  async assignUserToStore(user: UserEntity, inviter: UserEntity, storeId: string) {
    const storeExist = await this.storeRepository.findOne({ where: { id: storeId } });

    if (storeExist?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(inviter.id, storeId);

      if (isStoreUser) {
        await this.storeUsersService.create(user, storeExist, inviter);

        return true;
      }

      const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.assignUserToStore.name, input: { user: user, inviter: inviter, storeId: storeId } },
        `Inviter with id:'${inviter.id}' is not an active store user to the store with id: '${storeId}'.`
      );
      throw error;
    }

    const error = new HttpException(`Store with that id does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.assignUserToStore.name, input: { user: user, inviter: inviter, storeId: storeId } },
      `Store with id: '${storeId}' does not exist.`
    );
    throw error;
  }

  async addNewCategory(uid: string, id: string, createCategoryDto: CreateCategoryDto) {
    const isActiveStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

    if (isActiveStoreUser) {
      const store = await this.storeRepository.findOne({ where: { id: id } });

      if (store) {
        return this.categoriesService.addNewCategory(store, createCategoryDto);
      }

      const error = new HttpException(`The store does not exist.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.addNewCategory.name, input: { id: id, createCategoryDto: createCategoryDto } },
        `The store with id : '${id}' does not exist.`
      );

      throw error;
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.addNewCategory.name, input: { id: id, createCategoryDto: createCategoryDto } },
      `User with id:'${uid}' is not an active store user to the store with id: '${id}'.`
    );

    throw error;
  }

  // eslint-disable-next-line max-params
  async addNewSubCategory(uid: string, id: string, categoryId: string, createCategoryDto: CreateCategoryDto) {
    const isActiveStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

    if (isActiveStoreUser) {
      return this.categoriesService.addNewSubCategory(id, categoryId, createCategoryDto);
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.addNewSubCategory.name, input: { id: id, createCategoryDto: createCategoryDto } },
      `User with id:'${uid}' is not an active store user to the store with id: '${id}'.`
    );

    throw error;
  }

  async getAllCategories(id: string) {
    return this.categoriesService.findAllTreeByStore(id);
  }

  async getOneCategory(id: string, categoryId: string) {
    return this.categoriesService.findOneTree(categoryId, id);
  }

  // eslint-disable-next-line max-params
  async updateCategory(uid: string, id: string, categoryId: string, updateCategoryDto: Partial<CreateCategoryDto>) {
    const isActiveStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

    if (isActiveStoreUser) {
      return this.categoriesService.update(categoryId, id, updateCategoryDto);
    }
    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      {
        function: this.updateCategory.name,
        input: { uid: uid, id: id, categoryId: categoryId, updateCategoryDto: updateCategoryDto },
      },
      `User with id:'${uid}' is not an active store user to the store with id: '${id}'.`
    );

    throw error;
  }

  async deleteOneCategory(uid: string, id: string, categoryId: string) {
    const isActiveStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, id);

    if (isActiveStoreUser) {
      return this.categoriesService.delete(categoryId, id);
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      {
        function: this.updateCategory.name,
        input: { uid: uid, id: id, categoryId: categoryId },
      },
      `User with id:'${uid}' is not an active store user to the store with id: '${id}'.`
    );

    throw error;
  }

  async getStoreProducts(id: string) {
    return await this.productService.findAllByStore(id);
  }

  async getOneStoreProduct(id: string, pid: string) {
    try {
      return await this.productService.findOneStoreProduct(id, pid);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.getOneStoreProduct.name,
          input: { id: id, pid: pid },
          error: error,
        },
        `Internal Error occurred`
      );
      throw new HttpException(`Internal service error`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOneStoreOneCategoryProducts(id: string, categoryId: string) {
    try {
      return await this.productService.findStoreProductsByCategory(id, categoryId);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.getOneStoreOneCategoryProducts.name,
          input: { id: id, categoryId: categoryId },
          error: error,
        },
        `Internal Error occurred`
      );
      throw new HttpException(`Internal service error`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private createStore(name: string, description: string, owner: UserEntity) {
    const newStore = new Store();
    newStore.name = name;
    newStore.description = description;
    newStore.owner = owner;

    return newStore;
  }

  private flattenStore(store: Store): FlattenStore[] {
    const parent = store.parent ? store.parent.name : null;

    if (store.branches && store.branches.length > 0) {
      const branchNames = store.branches.map((branch) => branch.name);

      let flattenStore: FlattenStore[] = [{ ...store, parent: parent, branches: branchNames }];

      store.branches.forEach((branch) => {
        branch.parent = store;

        flattenStore = flattenStore.concat(this.flattenStore(branch));
      });

      return flattenStore;
    } else {
      return [{ ...store, parent: parent, branches: [] }];
    }
  }

  private flattenTree(tree: Store[]): FlattenStore[] {
    if (tree.length > 0) {
      let flattenTree: FlattenStore[] = [];

      tree.forEach((store) => {
        flattenTree = flattenTree.concat(this.flattenStore(store));
      });

      return flattenTree;
    } else {
      return [];
    }
  }
}
