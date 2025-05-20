import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { SerializedDelivery } from '../types/serialized-delivery.class';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createDeliveryDto',
      required: true,
      description: 'It must be a new delivery',
      type: CreateDeliveryDto,
    }),
    ApiOperation({
      summary: 'Create a delivery for order items.',
    }),
    ApiCreatedResponse({
      type: SerializedDelivery,
      description: 'The delivery was successfully created.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: { statusCode: HttpStatus.BAD_REQUEST, message: "Address/Order with id: '${id}' does not exist." },
      },
    }),
    ApiForbiddenResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
        },
      },
    })
  );
}
