/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { In, Like, Repository } from 'typeorm';
import { ProductService } from '../../product/service/product.service';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import { UserService } from '../../user-management/service/user.service';
import type { CreateStockDto, UpdateStockDto } from '../dto';
import type { ChangeStockQuantityDto } from '../dto/change-stock-quantity.dto';
import { Stock } from '../entity/stock.entity';
import { SerializedStock } from '../types/serialized-stock.class';

@Injectable()
export class StockService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Stock) private readonly stockRepository: Repository<Stock>,
    private readonly productService: ProductService,
    private readonly storeUsersService: StoreUsersService,
    private readonly usersService: UserService
  ) {}

  private readonly logger = new Logger(StockService.name);
  private readonly picturesStorageUrl = <string>process.env.AZURE_BLOB_STORAGE_URL;

  async create(uid: string, createStockDto: CreateStockDto) {
    const { productId, ...data } = createStockDto;

    try {
      // Fetch Product
      const product = await this.productService.findOneWithStore(productId);
      if (!product) {
        throw new HttpException(`Product with ID '${productId}' not found.`, HttpStatus.NOT_FOUND);
      }

      // Validate Store User
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(uid, product.category.store.id);
      if (!isStoreUser) {
        throw new HttpException('Unauthorized to manage this product.', HttpStatus.UNAUTHORIZED);
      }

      // Check for Existing Stock
      const stockExist = await this.stockRepository.findOne({
        where: { product: { id: productId }, keepingUnit: data.keepingUnit },
      });

      if (stockExist) {
        throw new HttpException('Stock with the same SKU already exists.', HttpStatus.CONFLICT);
      }

      // Create and Save Stock
      // Handle the type conversion for characteristics
      const stockData = {
        ...data,
        product,
      } as unknown as DeepPartial<Stock>;
      const newStock = this.stockRepository.create(stockData);
      const savedStock = await this.stockRepository.save(newStock);

      // Ensure we're working with a single stock object
      const stockResult = Array.isArray(savedStock) ? savedStock[0] : savedStock;
      this.logger.log(`Stock created successfully with ID '${stockResult.id}' for product '${product.name}'.`);

      return new SerializedStock(stockResult);
    } catch (error) {
      this.logger.error({ function: 'create', input: createStockDto, error: error.stack }, 'Failed to create stock.');
      throw error;
    }
  }

  async changeQuantity(uid: string, stockId: string, changeStockQuantityDto: ChangeStockQuantityDto) {
    const stockExist = await this.stockRepository.findOne({ where: { id: stockId } });

    if (stockExist?.id) {
      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(
        uid,
        stockExist.product.category.store.id
      );

      if (isStoreUser) {
        await this.stockRepository.update(stockExist.id, changeStockQuantityDto);

        const updatedStock = <Stock>await this.stockRepository.findOne({ where: { id: stockId } });

        return new SerializedStock(updatedStock);
      }

      const error = new HttpException(`You are not a store user of this product.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.changeQuantity.name, input: { uid: uid, changeStockQuantityDto: changeStockQuantityDto } },
        `User with id:'${uid}' is not the store user to the product with id: '${stockExist.product.id}'.`
      );

      throw error;
    }

    const error = new HttpException(`This product stock does not exist.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.changeQuantity.name, input: { uid: uid, changeStockQuantityDto: changeStockQuantityDto } },
      `Stock for product with id:'${stockId}' does not exist.`
    );

    throw error;
  }

  async decreaseQuantity(id: string, amount: number) {
    const stockExist = await this.stockRepository.findOne({ where: { id: id } });

    if (stockExist?.id) {
      // Ensure amount is valid and stock quantity is sufficient for reduction
      if (amount > 0 && stockExist.quantity >= amount) {
        stockExist.quantity -= amount; // Reduce the stock

        return await this.stockRepository.save(stockExist); // Save the updated stock
      } else {
        // If amount is invalid (negative) or insufficient stock
        if (amount <= 0) {
          const error = new HttpException(
            `Quantity to reduce must be greater than zero.`,
            HttpStatus.UNPROCESSABLE_ENTITY
          );

          this.logger.error(
            { function: this.decreaseQuantity.name, input: { id: id, amount: amount } },
            `The quantity to reduce must be greater than zero.`
          );
          throw error;
        } else {
          const error = new HttpException(
            `Insufficient stock to reduce by ${amount}. Only ${stockExist.quantity} items available.`,
            HttpStatus.UNPROCESSABLE_ENTITY
          );

          this.logger.error(
            { function: this.decreaseQuantity.name, input: { id: id, amount: amount } },
            `Insufficient stock to reduce by ${amount}.`
          );
          throw error;
        }
      }
    }

    const error = new HttpException(`This product stock does not exist.`, HttpStatus.NOT_FOUND);
    this.logger.error(
      { function: this.decreaseQuantity.name, input: { id: id, amount: amount } },
      `Stock for product with id:'${id}' does not exist.`
    );

    throw error;
  }
  async increaseQuantity(id: string, amount: number) {
    const stockExist = await this.stockRepository.findOne({ where: { id: id } });

    if (stockExist?.id) {
      if (amount > 0) {
        stockExist.quantity += amount;

        return await this.stockRepository.save(stockExist);
      } else {
        const error = new HttpException(`This quantity is less than zero.`, HttpStatus.UNPROCESSABLE_ENTITY);

        this.logger.error(
          { function: this.increaseQuantity.name, input: { id: id, amount: amount } },
          `The quantity to add is less than zero.`
        );

        throw error;
      }
    }
    const error = new HttpException(`This product stock does not exist.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.increaseQuantity.name, input: { id: id, amount: amount } },
      `Stock for product with id:'${id}' does not exist.`
    );

    throw error;
  }

  async update(uid: string, stockId: string, updateStockDto: UpdateStockDto) {
    const { keepingUnit } = updateStockDto;

    const stockToUpdate = await this.stockRepository.findOne({ where: { id: stockId } });

    if (stockToUpdate?.id) {
      if (keepingUnit) {
        const stockExist = await this.stockRepository.findOne({
          where: { product: { id: stockToUpdate.product.id }, keepingUnit: keepingUnit },
        });

        if (stockExist?.id) {
          const error = new HttpException(`There is a product stock with the same unit.`, HttpStatus.CONFLICT);

          this.logger.error(
            { function: this.update.name, input: { uid: uid, addStockDto: updateStockDto } },
            `Stock for product with id:'${stockToUpdate.product.id}' and SKU: '${keepingUnit}' already exist.`
          );

          throw error;
        }
      }

      const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreId(
        uid,
        stockToUpdate.product.category.store.id
      );

      if (isStoreUser) {
        const { characteristics, ...updateData } = updateStockDto;

        if (characteristics) {
          await this.stockRepository.update(stockToUpdate.id, {
            ...updateData,
            characteristics: <object>characteristics,
          });
        } else {
          await this.stockRepository.update(stockToUpdate.id, updateData);
        }

        const updatedStock = <Stock>await this.stockRepository.findOne({
          where: { product: { id: stockToUpdate.product.id }, keepingUnit: keepingUnit },
        });

        return new SerializedStock(updatedStock);
      }

      const error = new HttpException(`You are not a store user of the product store.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        { function: this.update.name, input: { uid: uid, updateStockDto: updateStockDto } },
        `User with id:'${uid}' is not the store user to the product with id: '${stockToUpdate.product.id}'.`
      );

      throw error;
    } else {
      const error = new HttpException(`The product stock does not exist.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.update.name, input: { uid: uid, addStockDto: updateStockDto } },
        `Product stock with id:'${stockId}' does not exist.`
      );

      throw error;
    }
  }

  async findOne(pid: string, stockKeepingUnit: string) {
    return await this.stockRepository.findOne({
      where: { product: { id: pid }, keepingUnit: stockKeepingUnit },
    });
  }

  async findOneByStockId(stockId: string) {
    return await this.stockRepository.findOne({
      where: { id: stockId },
    });
  }

  async findByUser(uid: string, productName?: string, pid?: string) {
    const isStoreUser = await this.storeUsersService.findByUserId(uid);

    if (isStoreUser.length) {
      const storeIds = isStoreUser.map((storeUser) => storeUser.store.id);

      if (pid) {
        // if productName and product Id are set,first priority
        if (productName) {
          const stocks = await this.stockRepository.find({
            where: [
              { product: { category: { store: { id: In(storeIds) } }, name: Like(`${productName}%`) } },
              { product: { category: { store: { id: In(storeIds) } }, id: Like(`${pid}%`) } },
            ],
          });

          return stocks.map((stock) => new SerializedStock(stock));
        }
        // if just product Id is set, second priority
        const stocks = await this.stockRepository.find({
          where: { product: { category: { store: { id: In(storeIds) } }, id: Like(`${pid}%`) } },
        });

        return stocks.map((stock) => new SerializedStock(stock));
      } else {
        // if product Id is is not set, and product Name is set, third priority
        if (productName) {
          const stocks = await this.stockRepository.find({
            where: { product: { category: { store: { id: In(storeIds) } }, name: Like(`${productName}%`) } },
          });

          return stocks.map((stock) => new SerializedStock(stock));
        }
        // if both product Id and product Name are not set, fourth priority
        const stocks = await this.stockRepository.find({
          where: { product: { category: { store: { id: In(storeIds) } } } },
        });

        return stocks.map((stock) => new SerializedStock(stock));
      }
    }

    const error = new HttpException(`You are not a store user.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findByUser.name, input: { uid: uid } },
      `User with id:'${uid}' is not a store user.`
    );

    throw error;
  }

  async findStocksByProductId(productId: string): Promise<SerializedStock[]> {
    try {
      const stocks = await this.stockRepository.find({
        where: { product: { id: productId } },
        relations: ['product'],
      });

      if (stocks.length === 0) {
        this.logger.warn(
          { function: this.findStocksByProductId.name, productId },
          `No stocks found for product with id: ${productId}`
        );
      }

      return stocks.map((stock) => {
        const serializedStock = new SerializedStock(stock);

        if (stock.likedBy) {
          serializedStock.liked = true;
        }
        if (stock.pictures) {
          serializedStock.pictures = stock.pictures.map((picture) => `${this.picturesStorageUrl}${picture}`);
        }

        return serializedStock;
      });
    } catch (error) {
      this.logger.error(
        { function: this.findStocksByProductId.name, productId, error },
        `Error occurred while fetching stocks for product with id: ${productId}`
      );
      throw new HttpException('Failed to fetch stocks for the product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findStocksByProductIds(productIds: string[]): Promise<SerializedStock[]> {
    try {
      const stocks = await this.stockRepository.find({
        where: { product: { id: In(productIds) } },
        relations: ['product'],
      });

      if (stocks.length === 0) {
        this.logger.warn(
          { function: this.findStocksByProductIds.name, productIds },
          `No stocks found for products with ids: ${productIds.join(', ')}`
        );
      }

      return stocks.map((stock) => {
        const serializedStock = new SerializedStock(stock);

        if (stock.likedBy) {
          serializedStock.liked = true;
        }
        if (stock.pictures) {
          serializedStock.pictures = stock.pictures.map((picture) => `${this.picturesStorageUrl}${picture}`);
        }

        return serializedStock;
      });
    } catch (error) {
      this.logger.error(
        { function: this.findStocksByProductIds.name, productIds, error },
        `Error occurred while fetching stocks for products with ids: ${productIds.join(', ')}`
      );
      throw new HttpException('Failed to fetch stocks for the products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findStocksByStockIds(stockIds: string[]): Promise<SerializedStock[]> {
    try {
      const stocks = await this.stockRepository.find({
        where: { id: In(stockIds) },
        relations: ['product'],
      });

      if (stocks.length === 0) {
        this.logger.warn(
          { function: this.findStocksByStockIds.name, stockIds },
          `No stocks found for stock IDs: ${stockIds.join(', ')}`
        );
      }

      return stocks.map((stock) => {
        const serializedStock = new SerializedStock(stock);

        // Check if stock is liked and set 'liked' flag accordingly
        if (stock.likedBy) {
          serializedStock.liked = true;
        }

        // Map the picture URLs
        if (stock.pictures) {
          serializedStock.pictures = stock.pictures.map((picture) => `${this.picturesStorageUrl}${picture}`);
        }

        return serializedStock;
      });
    } catch (error) {
      this.logger.error(
        { function: this.findStocksByStockIds.name, stockIds, error },
        `Error occurred while fetching stocks for stock IDs: ${stockIds.join(', ')}`
      );
      throw new HttpException('Failed to retrieve stocks for the provided stock IDs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async appreciateProductStock(uid: string, sid: string, like: boolean) {
    try {
      const stock = await this.stockRepository.findOne({ where: { id: sid }, relations: { likedBy: true } });

      if (!stock) {
        throw new HttpException('Stock was not found.', HttpStatus.NOT_FOUND);
      }

      const userIndex = stock.likedBy.findIndex((fan) => fan.id === uid);
      const alreadyLiked = userIndex !== -1;

      if (like && !alreadyLiked) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stock.likedBy.push({ id: uid } as any);
      } else if (!like && alreadyLiked) {
        stock.likedBy.splice(userIndex, 1);
      }

      await this.stockRepository.save(stock);

      return {
        message: `You ${like ? 'liked' : 'un-liked'} the stock ${stock.product.name + stock.keepingUnit.trim()}`,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(
        { function: 'appreciateProductStock', input: { uid, sid, like }, error },
        `Error while ${like ? 'liking' : 'un-liking'} stock with id: '${sid}' for user with id: '${uid}'.`
      );
      throw error;
    }
  }
}
