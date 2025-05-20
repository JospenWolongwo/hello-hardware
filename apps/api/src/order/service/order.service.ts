/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Address } from '../../address/entity/address.entity';
import { AddressService } from '../../address/service/address.service';
import { DeliveryService } from '../../delivery/service/delivery.service';
import type { OrderItem } from '../../order-item/entities/order-item.entity';
import { OrderItemService } from '../../order-item/service/order-item.service';
import { StoreUsersService } from '../../store-users/service/store-users.service';
import type { UserEntity } from '../../user-management/entities/user.entity';
import type { CreateOrderDto } from '../dto/create-order.dto';
import type { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import type { OrderState } from '../types/order.state';
import { SerializedOrder } from '../types/serialized-order.class';

@Injectable()
export class OrderService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly orderItemService: OrderItemService,
    private readonly addressService: AddressService,
    private readonly deliveryService: DeliveryService,
    private readonly storeUsersService: StoreUsersService
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async create(user: UserEntity, createOrderDto: CreateOrderDto) {
    const { items, deliveryAddressId, ...data } = createOrderDto;

    if (items.length < 1) {
      const error = new HttpException(`items should not be empty.`, HttpStatus.BAD_REQUEST);

      this.logger.error(
        { function: this.create.name, input: { createOrderDto: createOrderDto } },
        `items should not be empty.`
      );

      throw error;
    }

    const orderItemsToSave: OrderItem[] = [];

    for (const orderItem of items) {
      orderItemsToSave.push(await this.orderItemService.create(orderItem));
    }

    const newOrder = this.orderRepository.create(data);

    if (deliveryAddressId) {
      const userAddress = <Address>await this.addressService.findOneByUserId(deliveryAddressId, user.id);

      if (userAddress) {
        newOrder.deliveryAddress = userAddress;
      } else {
        const error = new HttpException(
          `Address with id: ${deliveryAddressId} belonging to you is not found.`,
          HttpStatus.NOT_FOUND
        );

        this.logger.error(
          { function: this.create.name, input: { createOrderDto: createOrderDto } },
          `Address with id: ${deliveryAddressId} belonging to user with id:${user.id} is not found.`
        );

        throw error;
      }
    }

    newOrder.user = user;

    newOrder.orderItems = orderItemsToSave;

    const savedOrder = await this.orderRepository.save(newOrder);

    return new SerializedOrder(savedOrder);
  }

  async findUserOrders(uid: string) {
    const isStoreUser = await this.storeUsersService.isActiveByUserId(uid);

    let orders;

    if (isStoreUser) {
      orders = await this.orderRepository.find();
    } else {
      orders = await this.orderRepository.find({ where: { user: { id: uid } } });
    }

    return orders.map((order) => new SerializedOrder(order));
  }

  async findUserOrder(uid: string, orderId: string) {
    const isStoreUser = await this.storeUsersService.isActiveByUserId(uid);

    let order;

    if (isStoreUser) {
      order = await this.orderRepository.findOne({ where: { id: orderId } });
    } else {
      order = await this.orderRepository.findOne({ where: { user: { id: uid }, id: orderId } });
    }

    if (order?.id) {
      return new SerializedOrder(order);
    } else {
      throw new NotFoundException('Order was not found');
    }
  }

  async changeOrderState(uid: string, orderId: string, status: OrderState) {
    const isStoreUser = await this.storeUsersService.isActiveByUserId(uid);

    let orderExist;

    if (isStoreUser) {
      orderExist = await this.orderRepository.findOne({ where: { id: orderId } });
    } else {
      orderExist = await this.orderRepository.findOne({ where: { id: orderId, user: { id: uid } } });
    }

    if (orderExist?.id) {
      if (orderExist.status !== 'completed') {
        // update order and order items states
        orderExist.status = status;

        orderExist.orderItems = orderExist.orderItems.map((orderItem) => {
          // a completed order has all items delivered
          if (status === 'completed') {
            orderItem.status = 'delivered';
          } else {
            orderItem.status = status;
          }

          return orderItem;
        });

        this.orderRepository.save(orderExist);

        return true;
      } else {
        const error = new HttpException(`A completed order can not change status`, HttpStatus.BAD_REQUEST);

        this.logger.error(
          { function: this.changeOrderState.name, input: { uid: uid, orderId: orderId, status: status } },
          `Order with id: '${orderId}' is completed.`
        );

        throw error;
      }
    }

    const error = new HttpException(`The order with id: '${orderId}' was not found`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.changeOrderState.name, input: { uid: uid, orderId: orderId, status: status } },
      `Order with id: '${orderId}' was not found`
    );

    throw error;
  }

  async cancelOrder(uid: string, orderId: string) {
    const isStoreUser = await this.storeUsersService.isActiveByUserId(uid);

    let orderExist;

    if (isStoreUser) {
      orderExist = await this.orderRepository.findOne({
        where: { id: orderId },
      });
    } else {
      orderExist = await this.orderRepository.findOne({ where: { id: orderId, user: { id: uid } } });
    }

    if (orderExist?.id) {
      orderExist.orderItems.forEach(async (orderItem) => {
        await this.orderItemService.restockOrderItem(orderItem.id);
      });
    } else {
      const error = new HttpException(`The order with id: '${orderId}' was not found`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.cancelOrder.name, input: { uid: uid, orderId: orderId } },
        `Order with id: '${orderId}' was not found`
      );

      throw error;
    }
  }

  async update(uid: string, orderId: string, updateOrderDto: UpdateOrderDto) {
    let orderExist;

    const isStoreUser = await this.storeUsersService.isActiveByUserId(uid);

    if (isStoreUser) {
      orderExist = await this.orderRepository.findOne({
        relations: { user: true, deliveryAddress: true },
        where: { id: orderId },
      });
    } else {
      orderExist = await this.orderRepository.findOne({
        relations: { user: true, deliveryAddress: true },
        where: { id: orderId, user: { id: uid } },
      });
    }

    if (orderExist?.id) {
      const { items, deliveryAddressId, ...restOfData } = updateOrderDto;

      if (items?.length) {
        const orderItems = orderExist.orderItems;

        for (const updateOrderItem of items) {
          const { stockId, quantity, discountPercentage } = updateOrderItem;

          const orderItemExist = orderItems.find((orderItem) => orderItem.productStock.id === stockId);

          if (orderItemExist?.id) {
            const index = orderItems.indexOf(orderItemExist);

            if (discountPercentage) {
              await this.orderItemService.update(orderItemExist.id, quantity, discountPercentage);

              orderItemExist.quantity = quantity;

              orderItemExist.discountPercentage = discountPercentage;
            } else {
              await this.orderItemService.update(orderItemExist.id, quantity);

              orderItemExist.quantity = quantity;
            }

            orderItems[index] = orderItemExist;
          } else {
            orderItems.push(await this.orderItemService.create(updateOrderItem));
          }
        }
      }

      if (deliveryAddressId) {
        let userAddress;

        if (isStoreUser) {
          userAddress = await this.addressService.findOne(deliveryAddressId);
        } else {
          userAddress = <Address>await this.addressService.findOneByUserId(deliveryAddressId, orderExist.user.id);
        }

        if (userAddress) {
          if (orderExist.deliveryAddress.id !== deliveryAddressId) {
            orderExist.orderItems.forEach(async (orderItem) => {
              if (orderItem?.delivery?.id) {
                await this.deliveryService.removeOrderItem(orderItem.delivery.id, orderItem.id);
              }
            });

            await this.orderRepository.update(orderId, {
              ...restOfData,
              deliveryAddress: userAddress,
            });

            const updateOrder = <Order>await this.orderRepository.findOneBy({ id: orderId });

            return new SerializedOrder(updateOrder);
          }
        } else {
          const error = new HttpException(`Address with id: ${deliveryAddressId} not found.`, HttpStatus.NOT_FOUND);

          this.logger.error(
            { function: this.update.name, input: { uid: uid, orderId: orderId, updateOrderDto: updateOrderDto } },
            `Address with id: ${deliveryAddressId} is not found.`
          );

          throw error;
        }
      }
    }

    const error = new HttpException(`Order with id: '${orderId}' not found`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.update.name, input: { uid: uid, orderId: orderId, updateOrderDto: updateOrderDto } },
      `Order with id: '${orderId}' was not found`
    );

    throw error;
  }
}
