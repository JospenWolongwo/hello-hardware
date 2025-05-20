import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateStoreDto } from '../dto/create-store.dto';

export function ApiCreate() {
  return applyDecorators(
    ApiParam({
      name: 'createStoreDto',
      required: true,
      description: 'It must be new store',
      type: CreateStoreDto,
    }),
    ApiOperation({
      summary: 'Add a new store',
    }),
    ApiCreatedResponse({
      description: 'The store was successfully created',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
        },
      },
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
