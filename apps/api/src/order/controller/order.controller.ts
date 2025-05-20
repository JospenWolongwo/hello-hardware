import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { arrayUnique } from 'class-validator';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UserService } from '../../user-management/service/user.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderService } from '../service/order.service';
import { ApiCancelOrder, ApiCreate, ApiFindByUser, ApiFindOneByUser, ApiUpdate } from '../swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly userService: UserService) {}

  private readonly logger = new Logger(OrderController.name);

  @Post('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateOrder'])
  @ApiCreate()
  async createOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      const user = await this.userService.findById(uid);
      if (createOrderDto.items.length > 0) {
        const uniqueItems = arrayUnique(createOrderDto.items.map((item) => item.stockId));

        if (uniqueItems) {
          return await this.orderService.create(user, createOrderDto);
        } else {
          throw new BadRequestException('items should have unique values');
        }
      } else {
        throw new BadRequestException('items should not be empty');
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.createOrder.name,
          input: { createOrderDto: createOrderDto },
          error: error,
        },
        `An error occurred when creating an order.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewOrders'])
  @ApiFindByUser()
  async getUserOrders(@Req() req: Request) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.orderService.findUserOrders(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.getUserOrders.name,
          error: error,
        },
        `An error occurred getting user's orders.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('/:id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewOrder'])
  @ApiFindOneByUser()
  async getUserOrder(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.orderService.findUserOrder(uid, id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.getUserOrders.name,
          error: error,
        },
        `An error occurred getting a user's order.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch('/:id')
  @ApiUpdate()
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['EditOrder'])
  async updateOrder(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) updateOrderDto: UpdateOrderDto
  ) {
    try {
      const { uid } = <AccountInfo>req.user;

      if (updateOrderDto?.items?.length) {
        const uniqueItems = arrayUnique(updateOrderDto.items.map((item) => item.stockId));

        if (!uniqueItems) {
          throw new BadRequestException('items should have unique values');
        }
      } else {
        throw new BadRequestException('items should not be empty');
      }

      return await this.orderService.update(uid, id, updateOrderDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.updateOrder.name,
          error: error,
        },
        `An error occurred when updating an order.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch('/:id/cancel')
  @ApiCancelOrder()
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CancelOrder'])
  async cancelOrder(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;

      await this.orderService.cancelOrder(uid, id);

      return { statusCode: HttpStatus.OK, message: `Order was successfully cancelled.` };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.cancelOrder.name,
          error: error,
        },
        `An error occurred when cancelling an order.`
      );
      throw InternalServerErrorException;
    }
  }
}
