/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import type { Stock } from '../../stock/entity/stock.entity';
import { StockService } from '../../stock/service/stock.service';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import type { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { SerializedOrderItem } from '../types/serialized-order-item.class';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    private readonly stockService: StockService,
    private readonly storeUsersService: StoreUsersService
  ) {}

  private readonly logger = new Logger(OrderItemService.name);

  async create(createOrderItemDto: CreateOrderItemDto) {
    const { stockId, quantity, discountPercentage } = createOrderItemDto;
    const stock = await this.stockService.findOneByStockId(stockId);

    if (stock?.id) {
      if (stock.quantity < quantity) {
        const error = new HttpException(`Product stock does not enough.`, HttpStatus.FORBIDDEN);

        this.logger.error(
          { function: this.create.name, input: { createOrderItemDto: createOrderItemDto } },
          `Product Stock with id: '${stockId}' is not enough(${stock.quantity}).`
        );

        throw error;
      }

      await this.stockService.decreaseQuantity(stock.id, quantity);

      const orderItem = this.orderItemRepository.create({
        productStock: stock,
        price: stock.price,
        quantity: quantity,
        discountPercentage: discountPercentage,
      });

      return orderItem;
    } else {
      const error = new HttpException(`Product stock not found.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.create.name, input: { createOrderItemDto: createOrderItemDto } },
        `Product stock with id: '${stockId}' does not exist.`
      );

      throw error;
    }
  }

  async update(id: string, quantity: number, discount?: number) {
    const orderItemExist = await this.orderItemRepository.findOne({ where: { id: id } });

    if (orderItemExist?.id) {
      if (quantity > orderItemExist.quantity) {
        const stock = <Stock>await this.stockService.findOneByStockId(orderItemExist.productStock.id);

        const change = quantity - orderItemExist.quantity;

        orderItemExist.quantity = quantity;

        await this.stockService.decreaseQuantity(stock.id, change);
      }

      if (quantity < orderItemExist.quantity) {
        const stock = <Stock>await this.stockService.findOneByStockId(orderItemExist.productStock.id);

        const change = orderItemExist.quantity - quantity;

        orderItemExist.quantity = quantity;

        await this.stockService.increaseQuantity(stock.id, change);
      }

      if (discount) {
        orderItemExist.discountPercentage = discount;
      }

      await this.orderItemRepository.save(orderItemExist);
    }
    const error = new HttpException(`Order item with id : ${id} was not found.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      {
        function: this.update.name,
        input: { id: id, quantity: quantity, discount: discount },
      },
      `Order item with id : ${id} was not found.`
    );

    throw error;
  }

  async restockOrderItem(id: string) {
    const orderItemExist = await this.orderItemRepository.findOne({ where: { id: id } });

    if (orderItemExist?.id) {
      const stock = <Stock>await this.stockService.findOneByStockId(orderItemExist.productStock.id);

      await this.stockService.increaseQuantity(stock.id, orderItemExist.quantity);
    }

    const error = new HttpException(`Order item with id : ${id} was not found.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      {
        function: this.restockOrderItem.name,
        input: { id: id },
      },
      `Order item with id : ${id} was not found.`
    );

    throw error;
  }

  private async findAllByStoreNamesAndProductName(storeNames: string[], productName = '') {
    return await this.orderItemRepository.find({
      relations: { order: true },
      where: {
        productStock: { product: { category: { store: { name: In(storeNames) } }, name: Like(`${productName}%`) } },
      },
    });
  }

  private async findAllByStoreNameAndProductName(storeName: string, productName = '') {
    return await this.orderItemRepository.find({
      relations: { order: true },
      where: {
        productStock: {
          product: { category: { store: { name: Like(`${storeName}%`) } }, name: Like(`${productName}%`) },
        },
      },
    });
  }

  async findAll(productName = '', storeName = '') {
    productName = productName.trim().toLowerCase();

    storeName = storeName.trim().toLowerCase();

    const orderItems = await this.orderItemRepository.find({
      relations: { order: true },
      where: {
        productStock: {
          product: { category: { store: { name: Like(`${storeName}%`) }, name: Like(`${productName}%`) } },
        },
      },
    });

    return orderItems.map((orderItem) => new SerializedOrderItem(orderItem));
  }

  async findByManager(uid: string, productName = '') {
    const isStoreUser = await this.storeUsersService.findByUserId(uid);

    productName = productName.trim().toLowerCase();

    if (isStoreUser?.length) {
      const storeNames = isStoreUser.map((storeUser) => storeUser.store.name);

      const orderItems = await this.findAllByStoreNamesAndProductName(storeNames, productName);

      return orderItems.map((orderItem) => new SerializedOrderItem(orderItem));
    }

    const error = new HttpException(`You are not a store user`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findByManager.name, input: { uid: uid, productName: productName } },
      `The user with id: '${uid}'is not a store user.`
    );

    throw error;
  }

  async findByOrder(uid: string, orderId: string, productName = '') {
    const isStoreUser = await this.storeUsersService.findByUserId(uid);

    productName = productName.trim().toLowerCase();

    if (isStoreUser?.length) {
      const storeNames = isStoreUser.map((storeUser) => storeUser.store.name);

      const orderItems = await this.orderItemRepository.find({
        relations: { order: true },
        where: {
          order: { id: orderId },
          productStock: { product: { name: Like(`${productName}%`), category: { store: { name: In(storeNames) } } } },
        },
      });

      return orderItems.map((orderItem) => new SerializedOrderItem(orderItem));
    }

    const error = new HttpException(`You are not a store user`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      { function: this.findByManager.name, input: { uid: uid } },
      `The user with id: '${uid}'is not a store user.`
    );

    throw error;
  }

  async findByManagerStore(uid: string, storeName: string, productName = '') {
    const isStoreUser = await this.storeUsersService.isActiveByUserIdAndStoreName(uid, storeName.toLowerCase());

    storeName = storeName.trim().toLowerCase();

    productName = productName.trim().toLowerCase();

    if (isStoreUser) {
      const orderItems = await this.findAllByStoreNameAndProductName(storeName, productName);

      return orderItems.map((orderItem) => new SerializedOrderItem(orderItem));
    }

    const error = new HttpException(
      `You are not an active user to a store with name like: ${storeName}.`,
      HttpStatus.UNAUTHORIZED
    );

    this.logger.error(
      { function: this.findByManagerStore.name, input: { uid: uid, storeName: storeName, productName: productName } },
      `The user with id: '${uid}'is not an active user to a store with name ${storeName}.`
    );

    throw error;
  }

  async findOneByIdAndDeliveryId(id: string, deliveryAddressId: string) {
    const orderItem = await this.orderItemRepository.findOne({
      relations: { order: { deliveryAddress: true } },
      where: { id: id, order: { deliveryAddress: { id: deliveryAddressId } } },
    });

    if (orderItem?.id) {
      return orderItem;
    }

    const error = new HttpException(
      `Order item with id : ${orderItem} delivered to the address with id: ${deliveryAddressId}, was not found.`,
      HttpStatus.NOT_FOUND
    );

    this.logger.error(
      {
        function: this.findOneByIdAndDeliveryId.name,
        input: { id: id, deliveryAddressId: deliveryAddressId },
      },
      `Order item with id : ${id} delivered to the address with id: ${deliveryAddressId} was not found.`
    );

    throw error;
  }

  async findOneById(id: string) {
    return await this.orderItemRepository.findOne({
      relations: { order: { deliveryAddress: true } },
      where: { id: id },
    });
  }
}
