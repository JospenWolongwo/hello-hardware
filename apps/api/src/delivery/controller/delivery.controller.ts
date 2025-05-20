import {
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { UpdateDeliveryStatusDto } from '../dto/update-delivery-status.dto';
import { DeliveryService } from '../service/delivery.service';
import { ApiChangeDeliveryStatus, ApiCreate, ApiFindAll, ApiFindByAddress } from '../swagger';

@ApiTags('Deliveries')
@ApiBearerAuth()
@Controller('deliveries')
@UseInterceptors(ClassSerializerInterceptor)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  private readonly logger = new Logger(DeliveryController.name);

  @Post('')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateDelivery'])
  @ApiCreate()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    try {
      return await this.deliveryService.create(createDeliveryDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.createDelivery.name,
          input: { createDeliveryDto: createDeliveryDto },
          error: error,
        },
        `An error occurred when creating a delivery.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewDeliveries'])
  @ApiFindAll()
  async findAllDeliveries() {
    try {
      return await this.deliveryService.findAll();
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.findAllDeliveries.name,
          error: error,
        },
        `An error occurred when finding all the deliveries.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('/address/:addressId')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewDeliveries'])
  @ApiFindByAddress()
  async findDeliveriesByAddress(@Param('addressId', new ParseUUIDPipe()) addressId: string) {
    try {
      return await this.deliveryService.findByAddressId(addressId);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.findAllDeliveries.name,
          error: error,
        },
        `An error occurred when finding deliveries by address Id.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch('/:id/status')
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ChangeDeliveryStatus'])
  @ApiChangeDeliveryStatus()
  async activateOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto
  ) {
    try {
      await this.deliveryService.changeStatus(id, updateDeliveryStatusDto.status);

      return { statusCode: HttpStatus.OK, message: `Delivery was successfully ${updateDeliveryStatusDto.status}.` };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.activateOrder.name,
          error: error,
        },
        `An error occurred when changing a delivery status.`
      );
      throw InternalServerErrorException;
    }
  }
}
