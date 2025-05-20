import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { OrderItemService } from '../service/order-item.service';
import { ApiFindAllOrderItems, ApiFindOrderItems, ApiFindOrderItemsByOrderId } from '../swagger';

@ApiTags('Order Items')
@ApiBearerAuth()
@Controller('order-items')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  private readonly logger = new Logger(OrderItemController.name);

  @Get('')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewAllOrderItems'])
  @ApiFindAllOrderItems()
  async findAllOrderItems(@Query('name') name: string, @Query('product') product: string) {
    try {
      if (name) {
        if (product) {
          return await this.orderItemService.findAll(name, product);
        }

        return await this.orderItemService.findAll(name);
      } else {
        if (product) {
          return await this.orderItemService.findAll(product);
        }

        return await this.orderItemService.findAll();
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.findOrderItems.name,
          error: error,
        },
        `An error occurred when looking for all order items.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('/orders')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewOrderItems'])
  @ApiFindOrderItems()
  async findOrderItems(@Query('name') name: string, @Query('product') product: string, @Req() req: Request) {
    try {
      const { uid } = <AccountInfo>req.user;

      if (name) {
        if (product) {
          return await this.orderItemService.findByManagerStore(uid, name, product);
        }

        return await this.orderItemService.findByManagerStore(uid, name);
      } else {
        if (product) {
          return await this.orderItemService.findByManager(uid, product);
        }

        return await this.orderItemService.findByManager(uid);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.findOrderItems.name,
          error: error,
        },
        `An error occurred when looking order items.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('/orders/:orderId')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewOrderItems'])
  @ApiFindOrderItemsByOrderId()
  async findOrderItemsByOrderId(
    @Query('product') product: string,
    @Req() req: Request,
    @Param('orderId', new ParseUUIDPipe()) orderId: string
  ) {
    try {
      const { uid } = <AccountInfo>req.user;

      if (product) {
        return await this.orderItemService.findByOrder(uid, orderId, product);
      }

      return await this.orderItemService.findByOrder(uid, orderId);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.findOrderItemsByOrderId.name,
          error: error,
        },
        `An error occurred getting an order order items.`
      );
      throw InternalServerErrorException;
    }
  }
}
