/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoryService } from '../../category/service/category.service';
import { ElasticsearchService } from '../../elasticsearch/services/elasticsearch.service';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import { UserService } from '../../user-management/service/user.service';
import type { CreateProductDto } from '../dto/create-product.dto';
import type { ToggleProductDto } from '../dto/toggle-product.dto';
import type { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entity/product.entity';
import { ProductWithStock } from '../type/productWithStock.class';
import { SerializedProduct } from '../type/serializedProduct.class';

@Injectable()
export class ProductService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly usersService: UserService,
    private readonly storeUserService: StoreUsersService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  private readonly logger = new Logger(ProductService.name);
  private readonly picturesStorageUrl = <string>process.env.AZURE_BLOB_STORAGE_URL;

  async create(uid: string, createProductDto: CreateProductDto) {
    const { category, ...data } = createProductDto;

    const existingCategory = await this.categoryService.getCategoryById(category);

    // if the category exist
    if (existingCategory?.name) {
      //Check if user is a store user to the store the category belong to, if true we proceed to the product verification
      const isStoreUser = await this.storeUserService.isActiveByUserIdAndStoreId(uid, existingCategory.store.id);

      if (isStoreUser) {
        // Check if the product in that store already exist, with the same name and category
        const productExist = await this.productRepository.exist({
          where: { name: data.name, category: { id: category } },
        });

        // if it doesn't exist, we create a new product amd return it.
        if (!productExist) {
          const newProduct = this.productRepository.create({
            ...data,
            category: existingCategory,
          });

          const savedProduct = await this.productRepository.save(newProduct);

          await this.elasticsearchService.addProductDocument(savedProduct);

          return new SerializedProduct(savedProduct);
        }

        // else if the product already exist we throw an error
        const error = new HttpException(
          `Invalid input. The product with the name ${data.name} is already taken.`,
          HttpStatus.BAD_REQUEST
        );
        this.logger.error(
          { function: this.create.name, input: { createProductDto: createProductDto, uid: uid }, error: error },
          `Invalid input. The product with the name ${data.name} is already taken.`
        );

        throw error;
      }

      // else if the user is not an active store user to the store to which category belong
      const error = new HttpException(`You are not an active store user of this category.`, HttpStatus.UNAUTHORIZED);
      this.logger.error(
        { function: this.create.name, input: { uid: uid, createProductDto: createProductDto } },
        `User with id: '${uid}' is not an active store user to the category with id: '${category}'.`
      );

      throw error;
    }

    // Else if the category does not exist, we throw an error
    const error = new HttpException(`Invalid input. The category does not exist.`, HttpStatus.BAD_REQUEST);
    this.logger.error(
      { function: this.create.name, input: { uid: uid, createProductDto: createProductDto }, error: error },
      `Invalid input. The category with id '${category}' does not exist.`
    );

    throw error;
  }

  async update(pid: string, uid: string, updateProductDto: UpdateProductDto) {
    // get the product
    const product = await this.productRepository.findOne({
      where: { id: pid },
      relations: { category: { store: true } },
    });

    // If product exist check if user is an active store user to the product store
    if (product?.name) {
      const isStoreUser = await this.storeUserService.isActiveByUserIdAndStoreId(uid, product.category.store.id);

      // if he is a store user, he can update the product
      if (isStoreUser) {
        const { category, extraAttributes, ...data } = updateProductDto;

        // update product with string attributes
        await this.productRepository.update(pid, {
          ...data,
        });

        // If store or category or extraAttributes is set, we get the required information and update the product with save
        if (category || extraAttributes) {
          const productToUpdate = <Product>await this.productRepository.findOneBy({ id: pid });

          if (extraAttributes) {
            productToUpdate.extraAttributes = extraAttributes;
          }

          if (category) {
            const searchedCategory = await this.categoryService.getCategoryById(category);

            // If the searched category does not exist, an error is thrown.
            if (searchedCategory === null) {
              const error = new HttpException(`Invalid input. The category does not exist.`, HttpStatus.BAD_REQUEST);

              this.logger.error(
                { function: 'update', input: { updateProductDto: updateProductDto, uid: uid, pid: pid }, error: error },
                `Invalid input. The category with the id '${category}' does not exist.`
              );

              throw error;
            } else {
              //Else the category is assigned to the product
              productToUpdate.category = searchedCategory;
            }
          }

          await this.productRepository.save(productToUpdate);
        }

        const updatedProduct = await this.productRepository.findOneBy({ id: pid });

        if (!updatedProduct) {
          throw new HttpException(`The product with id '${pid}' no longer exists after update.`, HttpStatus.NOT_FOUND);
        }

        await this.elasticsearchService.updateProductDocument(updatedProduct);

        return new SerializedProduct(<Product>updatedProduct);
      }

      // User is not a store user and an error is thrown
      const error = new HttpException(`You are not an active store user of this product.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: 'update', input: { updateProductDto: updateProductDto, uid: uid, pid: pid }, error: error },
        `User with id: '${uid}' is not an active store user to the product with id: '${pid}'.`
      );

      throw error;
    }
    // Else if product is not found, an error is thrown
    const error = new HttpException(
      `Invalid input. The product with the id: '${pid}' does not exist.`,
      HttpStatus.BAD_REQUEST
    );

    this.logger.error(
      { function: 'update', input: { updateProductDto: updateProductDto, uid: uid, pid: pid }, error: error },
      `Invalid input. The product with the id: '${pid}' does not exist.`
    );

    throw error;
  }

  async toggleProducts(uid: string, toggleProductDto: ToggleProductDto) {
    // Get the products' ID, the store Id to which the products belong and the status
    const { products, category, status } = toggleProductDto;

    // check if a category with that ID exists, if true verify if user is a store user
    const existingCategory = await this.categoryService.getCategoryById(category);

    if (existingCategory) {
      // verify if user is an active store user to the store with the corresponding id
      const isStoreUser = await this.storeUserService.isActiveByUserIdAndStoreId(uid, existingCategory.store.id);

      // if he is a store user toggle the products
      if (isStoreUser) {
        await this.productRepository
          .update({ id: In(products), category: { id: category } }, { active: status })
          .catch((error) => {
            this.logger.error(
              {
                function: this.toggleProducts.name,
                error: error,
                input: { uid: uid, toggleProductDto: toggleProductDto },
              },
              `Failed to toggle products of a store.`
            );

            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
          });

        return true;
      }

      // Else if user is not an active store user to the store, throw an error
      const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        {
          function: this.toggleProducts.name,
          input: { uid: uid, toggleProductDto: toggleProductDto },
          error: error,
        },
        `The user with id: '${uid}' is not an active store user to the store with id:${existingCategory.store.id}.".`
      );

      throw error;
    }

    // Else if category does not exist, throw error
    const error = new HttpException(`Invalid input. The category does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      {
        function: this.toggleProducts.name,
        input: { uid: uid, toggleProductDto: toggleProductDto },
        error: error,
      },
      `Invalid input. The category with id '${category}' does not exist.`
    );

    throw error;
  }

  async findAllManagedByUser(uid: string) {
    // Find all the stores where the user is an active store user
    const storeUsers = await this.storeUserService.findByUserId(uid);

    // Verify if the list is not empty
    if (storeUsers.length) {
      // Convert the list of store to a list of store ids
      const storesId = storeUsers.map((storeUser) => storeUser.store.id);

      // Get all products the various store where the user is the owner or a store user to the store
      const products = await this.productRepository.find({
        relations: ['category', 'category.store'],
        where: { category: { store: [{ owner: { id: uid } }, { id: In(storesId) }] } },
        order: { category: { store: { name: 'ASC' }, createdAt: 'ASC' } },
      });

      return products.map((product) => new SerializedProduct(product));
    }

    // If List is empty, then user is not an active store user to a store, then throw an error
    const error = new HttpException(`You are not an active store user.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: 'findAllByUser', input: { uid: uid }, error: error },
      `User with id: '${uid}' is not an active store user.`
    );

    throw error;
  }

  async findAllByStore(storeId: string) {
    const storeCategories = await this.categoryService.findAllFlattenByStore(storeId);

    const storeCategoryIds = storeCategories.map((storeCategory) => storeCategory.id);

    const storeProducts = await this.productRepository.find({
      where: { category: { id: In(storeCategoryIds) } },
      order: { createdAt: 'ASC' },
      relations: {
        stocks: true,
      },
    });

    return storeProducts.map((storeProduct) => new ProductWithStock(storeProduct));
  }

  async findOneWithStore(pid: string) {
    try {
      // Fetch product with relations
      const product = await this.productRepository.findOne({
        where: { id: pid },
        relations: ['category', 'category.store'],
      });

      if (product) {
        return new SerializedProduct(product);
      }

      // Throw error if product not found
      throw new HttpException('Product was not found.', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(
        { function: this.findOne.name, input: { pid }, error: error.message || error },
        `Error finding product with ID '${pid}'.`
      );
      throw error;
    }
  }

  async findOne(pid: string) {
    // Get the product by Id
    const product = await this.productRepository.findOneBy([{ id: pid }]);

    // If the product exist, return it
    if (product?.name) {
      return new SerializedProduct(product);
    }

    // Else if the product does not exist, throw an error
    const error = new HttpException('Product was not found.', HttpStatus.NOT_FOUND);
    this.logger.error(
      { function: this.findOne.name, input: { pid: pid } },
      `The product with id: '${pid}' was not found.`
    );

    throw error;
  }

  async findOneStoreProduct(storeId: string, pid: string) {
    const product = await this.productRepository.findOne({
      where: { id: pid, category: { store: { id: storeId } } },
      relations: {
        stocks: true,
      },
    });

    // If the product exist, return it
    if (product?.name) {
      return new ProductWithStock(product);
    }

    // Else if the product does not exist, throw an error
    const error = new HttpException('Product was not found.', HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.findOneStoreProduct.name, input: { storeId: storeId, pid: pid } },
      `The product with id: '${pid}' belonging to store with id: '${storeId}' was not found.`
    );

    throw error;
  }

  async findStoreProductsByCategory(storeId: string, categoryId: string) {
    try {
      // the store category and all the categories under it
      const storeCategories = await this.categoryService.findOneFlatten(categoryId, storeId);

      const storeCategoryIds = storeCategories.map((storeCategory) => storeCategory.id);

      const storeProducts = await this.productRepository.find({
        where: { category: { id: In(storeCategoryIds) } },
        order: { createdAt: 'ASC' },
        relations: {
          stocks: true,
        },
      });

      return storeProducts.map((storeProduct) => new ProductWithStock(storeProduct));
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.findStoreProductsByCategory.name,
          input: { storeId: storeId, categoryId: categoryId },
          error: error,
        },
        `Internal Error occurred`
      );
      throw new HttpException(`Internal Error`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async appreciateProduct(uid: string, pid: string, like: boolean) {
    try {
      const product = await this.productRepository.findOne({ where: { id: pid }, relations: { likedBy: true } });

      if (!product) {
        throw new HttpException('Product was not found.', HttpStatus.NOT_FOUND);
      }

      const userIndex = product.likedBy.findIndex((fan) => fan.id === uid);
      const alreadyLiked = userIndex !== -1;

      if (like && !alreadyLiked) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product.likedBy.push({ id: uid } as any);
      } else if (!like && alreadyLiked) {
        product.likedBy.splice(userIndex, 1);
      }

      await this.productRepository.save(product);

      return {
        message: `You ${like ? 'liked' : 'un-liked'} the ${product.name}`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(
        { function: 'appreciateProduct', input: { uid, pid, like }, error },
        `Error while ${like ? 'liking' : 'un-liking'} product with id: '${pid}' for user with id: '${uid}'.`
      );
      throw error;
    }
  }

  async findOneByUser(pid: string, uid: string) {
    // Get a list of stores to which user is a store user
    const storeUsers = await this.storeUserService.findByUserId(uid);

    // Verify if the list of stores is not empty
    if (storeUsers.length) {
      // Convert the list of stores to a list of store Ids
      const storesId = storeUsers.map((storeUser) => storeUser.store.id);

      // Get a product with respect to its Id and in one the stores the user belong.
      const product = await this.productRepository.findOneBy([
        { id: pid, category: { store: [{ owner: { id: uid } }, { id: In(storesId) }] } },
      ]);

      // If the product exist, return it
      if (product?.name) {
        return new SerializedProduct(product);
      }

      // Else if the product does not exist, throw an error
      const error = new HttpException('Product was not found in your stores.', HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: 'findOneByUser', input: { pid: pid, uid: uid }, error: error },
        `The product with id: '${pid}', was not found in stores managed by user with id: '${uid}'.`
      );

      throw error;
    }

    // Else if store list is empty, user is not a store user, throw an error
    const error = new HttpException(`You are not an active store user.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: 'findOneByUser', input: { pid: pid, uid: uid }, error: error },
      `User with id: '${uid}' is not an active store user.`
    );

    throw error;
  }

  async findProducts(limit?: number) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('product.likedBy', 'likedBy')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.createdAt', 'DESC');

    if (limit) {
      query.take(limit);
    }

    const products = await query.getMany();

    const serializedProducts = products.map((product) => {
      const serializedProduct = new SerializedProduct(product);
      serializedProduct.liked = product.likedBy.length > 0;

      // If imageUrl exists, prepend storage URL
      if (product.imageUrl) {
        serializedProduct.imageUrl = `${this.picturesStorageUrl}${product.imageUrl}`;
      }

      return serializedProduct;
    });

    // Return the serialized products (already limited if the query.take was used)
    return serializedProducts;
  }

  async deleteProduct(pid: string, uid: string): Promise<{ message: string; statusCode: number }> {
    // Retrieve the product by ID, including its category and store relations
    const product = await this.productRepository.findOne({
      where: { id: pid },
      relations: { category: { store: true } },
    });

    // If the product exists, proceed with checks
    if (product?.name) {
      // Check if the user is an active store user of the product's store
      const isStoreUser = await this.storeUserService.isActiveByUserIdAndStoreId(uid, product.category.store.id);

      if (isStoreUser) {
        await this.productRepository.delete(pid);

        // Remove the product from Elasticsearch
        try {
          await this.elasticsearchService.deleteProductDocument(pid);
        } catch (error) {
          this.logger.error(
            { function: 'deleteProduct', input: { pid, uid }, error },
            `Error while deleting product document from Elasticsearch for product with id: '${pid}'.`
          );
        }

        this.logger.log(
          { function: 'deleteProduct', input: { pid, uid } },
          `Product with id: '${pid}' successfully deleted by user with id: '${uid}'.`
        );

        return {
          message: `Product with id '${pid}' has been successfully deleted.`,
          statusCode: HttpStatus.OK,
        };
      }

      // User is not authorized to delete this product
      const error = new HttpException(`You are not authorized to delete this product.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: 'deleteProduct', input: { pid, uid }, error },
        `Unauthorized delete attempt by user with id: '${uid}' for product with id: '${pid}'.`
      );

      throw error;
    }

    // Product not found
    const error = new HttpException(`Product with id '${pid}' does not exist.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: 'deleteProduct', input: { pid, uid }, error },
      `The product with id: '${pid}' does not exist.`
    );

    throw error;
  }

  async searchProducts(query: string, page = 1, size = 10) {
    return this.elasticsearchService.searchProducts(query, page, size);
  }
}
