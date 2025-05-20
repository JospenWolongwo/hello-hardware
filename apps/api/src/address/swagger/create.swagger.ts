import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateAddressDto } from '../dto/create-address.dto';
import { SerializedAddressEntity } from '../types/serializedAddressEntity.class';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the user',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'createAddressDto',
      required: true,
      description: 'It must be new address',
      type: CreateAddressDto,
    }),
    ApiOperation({
      summary: 'Add a new address to a user',
    }),
    ApiCreatedResponse({
      type: SerializedAddressEntity,
      description: 'The address was successfully created',
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input.',
        },
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
