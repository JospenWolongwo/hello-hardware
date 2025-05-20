import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressService } from '../../address/service/address.service';
import type { OrderItem } from '../../order-item/entities/order-item.entity';
import { OrderItemService } from '../../order-item/service/order-item.service';
import type { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { Delivery } from '../entities/delivery.entity';
import type { DeliveryState } from '../types/delivery.state';
import { SerializedDelivery } from '../types/serialized-delivery.class';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly deliveryRepository: Repository<Delivery>,
    private readonly orderItemService: OrderItemService,
    private readonly addressService: AddressService
  ) {}

  private readonly logger = new Logger(DeliveryService.name);

  async create(createDeliveryDto: CreateDeliveryDto) {
    const { orderItems, deliveryAddressId, charges, details } = createDeliveryDto;

    const address = await this.addressService.findOne(deliveryAddressId);

    if (address?.id) {
      const orderItemsToDeliver: OrderItem[] = [];

      for (const orderId of orderItems) {
        try {
          const orderItem = await this.orderItemService.findOneByIdAndDeliveryId(orderId, deliveryAddressId);

          orderItemsToDeliver.push(orderItem);
        } catch (error) {
          throw error;
        }
      }

      const newDelivery = this.deliveryRepository.create({ charges: charges, details: details });

      newDelivery.address = address;

      newDelivery.orderItems = orderItemsToDeliver;

      const savedDelivery = await this.deliveryRepository.save(newDelivery);

      return new SerializedDelivery(savedDelivery);
    }

    const error = new HttpException(`Address with id: '${deliveryAddressId}' does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.create.name, input: { createDeliveryDto: createDeliveryDto } },
      `Address with id: '${deliveryAddressId}' does not exist.`
    );

    throw error;
  }

  async findAll() {
    const deliveries = await this.deliveryRepository.find({ relations: { orderItems: { order: true } } });

    return deliveries.map((delivery) => new SerializedDelivery(delivery));
  }

  async removeOrderItem(deliveryId: string, orderItemId: string) {
    const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId } });

    if (delivery?.id) {
      delivery.orderItems = delivery.orderItems.filter((orderItem) => orderItem.id !== orderItemId);

      await this.deliveryRepository.save(delivery);

      return true;
    } else {
      return false;
    }
  }

  async changeDelivery(orderItemId: string, newDeliveryId: string) {
    const orderItem = await this.orderItemService.findOneById(orderItemId);

    if (orderItem?.id) {
      await this.removeOrderItem(orderItem.delivery.id, orderItem.id);

      const delivery = await this.deliveryRepository.findOne({ where: { id: newDeliveryId } });

      if (delivery?.id) {
        delivery.orderItems.push(orderItem);

        await this.deliveryRepository.save(delivery);
      }

      const error = new HttpException(`Delivery with id: '${newDeliveryId}' does not exist.`, HttpStatus.BAD_REQUEST);

      this.logger.error(
        { function: this.changeDelivery.name, input: { orderItemId: orderItemId, newDeliveryId: newDeliveryId } },
        `Delivery with id: '${newDeliveryId}' does not exist.`
      );

      throw error;
    }

    const error = new HttpException(`Order with id: '${orderItemId}' does not exist.`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.changeDelivery.name, input: { orderItemId: orderItemId, newDeliveryId: newDeliveryId } },
      `Order with id: '${orderItemId}' does not exist.`
    );

    throw error;
  }

  async findByAddressId(addressId: string) {
    const deliveries = await this.deliveryRepository.find({
      relations: { address: true, orderItems: { order: true } },
      where: { address: { id: addressId } },
    });

    return deliveries.map((delivery) => new SerializedDelivery(delivery));
  }

  async changeStatus(deliveryId: string, status: DeliveryState) {
    const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId } });

    if (delivery?.id) {
      await this.deliveryRepository.update({ id: deliveryId }, { status: status });

      return true;
    }

    const error = new HttpException(`Delivery with id: '${deliveryId}' does not exist`, HttpStatus.BAD_REQUEST);

    this.logger.error(
      { function: this.changeStatus.name, input: { deliveryId: deliveryId, status: status } },
      `Delivery with id: '${deliveryId}' does not exist`
    );

    throw error;
  }
}
