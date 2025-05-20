/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import type { Store } from '../../store/entities/store.entity';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import type { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';
import { FlattenCategory } from '../types/flattenCategory.class';
import { SerializedCategory } from '../types/serializedCategory.class';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
    private readonly storeUserService: StoreUsersService
  ) {}

  private readonly logger = new Logger(CategoryService.name);

  async addNewCategory(store: Store, createCategoryDto: CreateCategoryDto) {
    const parentCategoryByName = await this.findByName(createCategoryDto.name, store.id);

    if (parentCategoryByName) {
      const error = new HttpException(`The category ${createCategoryDto.name} already exist`, HttpStatus.CONFLICT);

      this.logger.error(
        {
          function: this.addNewCategory.name,
          input: { store: store, createCategoryDto: createCategoryDto },
        },
        `The category ${createCategoryDto.name} already exist`
      );

      throw error;
    }

    const newCategory = this.createCategory(createCategoryDto.name, createCategoryDto.description);

    newCategory.store = store;

    const createdCategory = await this.categoryRepository.save(newCategory).catch((error) => {
      this.logger.error(
        {
          function: this.addNewCategory.name,
          input: { store: store, createCategoryDto: createCategoryDto },
          error: error,
        },
        `Failed to save new category ${createCategoryDto.name}`
      );

      throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return new SerializedCategory(createdCategory);
  }

  async addNewSubCategory(storeId: string, parentId: string, createCategoryDto: CreateCategoryDto) {
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentId, store: { id: storeId } },
      relations: { store: true },
    });

    if (!parentCategory) {
      const error = new HttpException(`The parent category was not found`, HttpStatus.NOT_FOUND);

      this.logger.error(
        {
          function: this.addNewSubCategory.name,
          input: { storeId: storeId, parentId: parentId, createCategoryDto: createCategoryDto },
        },
        `The parent category with id: '${parentId}' belonging to a store with id '${storeId}' does not exist`
      );

      throw error;
    }

    const categoryWithSameName = await this.findSubCategoryByName(createCategoryDto.name, parentId);

    if (categoryWithSameName) {
      const error = new HttpException(`The sub-category ${createCategoryDto.name} already exist`, HttpStatus.CONFLICT);
      this.logger.error(
        {
          function: this.addNewSubCategory.name,
          input: { storeId: storeId, parentId: parentId, createCategoryDto: createCategoryDto },
        },
        `The sub-category ${createCategoryDto.name} already exist`
      );

      throw error;
    }

    const newCategory = this.createCategory(createCategoryDto.name, createCategoryDto.description);
    newCategory.parent = parentCategory;
    newCategory.store = parentCategory.store;

    const createdStore = await this.categoryRepository.save(newCategory).catch((error) => {
      this.logger.error(
        {
          function: this.addNewSubCategory.name,
          input: { storeId: storeId, parentId: parentId, createCategoryDto: createCategoryDto },
          error: error,
        },
        `Failed to save a new sub-category`
      );

      throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return new SerializedCategory(createdStore);
  }

  async findAllTreeByStore(storeId: string) {
    const categories = await this.categoryRepository.findTrees({ relations: ['store'] });

    return categories
      .filter((category) => category.store.id === storeId)
      .map((filteredCategory) => new SerializedCategory(filteredCategory));
  }

  async findAllFlattenByStore(storeId: string) {
    const categories = await this.categoryRepository.findTrees({ relations: ['store'] });

    const storeCategoryTrees = categories.filter((category) => category.store.id === storeId);

    const storeCategories: FlattenCategory[] = [];

    storeCategoryTrees.forEach((storeCategoryTree) => storeCategories.push(...this.flattenCategory(storeCategoryTree)));

    return storeCategories;
  }

  async findManagedCategories(uid: string) {
    const storeUsers = await this.storeUserService.findByUserId(uid);
    const storeIds = storeUsers.map((storeUser) => storeUser.store.id);

    if (storeIds.length > 0) {
      const categories = await this.categoryRepository.findTrees({ relations: ['store'] });

      return categories
        .filter((category) => storeIds.includes(category.store.id))
        .map((filteredCategory) => new SerializedCategory(filteredCategory));
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findManagedCategories.name, input: { uid: uid } },
      `Active user with id:'${uid}' is not found.`
    );
    throw error;
  }

  async findOneTree(id: string, storeId: string) {
    const category = await this.getCategory(id, storeId);

    if (category) {
      const storeWithDescendants = await this.categoryRepository.findDescendantsTree(category);

      return new SerializedCategory(storeWithDescendants);
    }

    const error = new HttpException('Category was not found.', HttpStatus.NOT_FOUND);

    this.logger.error(
      {
        function: this.findOneTree.name,
        input: { id: id, storeId: storeId },
        error: error,
      },
      `Category with id: '${id}' does not exist`
    );

    throw error;
  }

  async findOneFlatten(id: string, storeId: string) {
    const category = await this.getCategory(id, storeId);

    if (category) {
      const storeWithDescendants = await this.categoryRepository.findDescendantsTree(category);

      return this.flattenCategory(storeWithDescendants);
    }

    const error = new HttpException('Category was not found.', HttpStatus.NOT_FOUND);

    this.logger.error(
      {
        function: this.findOneFlatten.name,
        input: { id: id, storeId: storeId },
        error: error,
      },
      `Category with id: '${id}' does not exist`
    );

    throw error;
  }

  async update(id: string, storeId: string, updateCategoryDto: Partial<CreateCategoryDto>) {
    await this.categoryRepository.update(id, updateCategoryDto).catch((error) => {
      this.logger.error(
        {
          function: this.update.name,
          input: { id: id, storeId: storeId, updateCategoryDto: updateCategoryDto },
          error: error,
        },
        `Failed to update Category with id: '${id}'`
      );

      throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    });

    const updateCategory = await this.getCategory(id, storeId);

    if (updateCategory?.id) {
      return new SerializedCategory(updateCategory);
    }

    const error = new HttpException('Category was not found.', HttpStatus.NOT_FOUND);
    this.logger.error(
      {
        function: this.update.name,
        input: { id: id, storeId: storeId, updateCategoryDto: updateCategoryDto },
      },
      `Category with id: '${id}' does not exist`
    );

    throw error;
  }

  async delete(id: string, storeId: string) {
    await this.categoryRepository.delete({ id: id, store: { id: storeId } }).catch((error) => {
      this.logger.error(
        {
          function: this.delete.name,
          input: { id: id, storeId: storeId },
          error: error,
        },
        `Failed to delete Category with id: '${id}'`
      );

      throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    });

    return { message: 'The category and its subcategories were deleted successfully', statusCode: HttpStatus.OK };
  }

  private createCategory(name: string, description: string) {
    const newCategory = new Category();

    newCategory.name = name;
    newCategory.description = description;

    return newCategory;
  }

  private async getCategory(id: string, storeId: string) {
    const category = this.categoryRepository.findOne({
      where: {
        id: id,
        store: { id: storeId },
      },
      relations: { store: true, subCategories: true },
    });

    return category;
  }

  async getCategoryById(id: string) {
    const category = this.categoryRepository.findOne({
      where: {
        id: id,
      },
      relations: { store: true },
    });

    return category;
  }

  async findSubCategoryByName(name: string, parentId: string) {
    const category = this.categoryRepository.findOne({
      where: {
        name: name,
        parent: { id: parentId },
      },
    });

    return category;
  }

  async findByName(name: string, storeId: string) {
    const category = this.categoryRepository.findOne({
      where: {
        name: name,
        store: { id: storeId },
      },
      relations: { store: true },
    });

    return category;
  }

  private flattenCategory(category: Category): FlattenCategory[] {
    let categoryList: FlattenCategory[] = [new FlattenCategory(category)];

    if (category.subCategories && category.subCategories.length > 0) {
      category.subCategories.forEach((subCategory) => {
        subCategory.parent = category;

        categoryList = categoryList.concat(this.flattenCategory(subCategory));
      });

      return categoryList;
    } else {
      return categoryList;
    }
  }
}
