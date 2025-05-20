import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  PartialType,
} from '@nestjs/swagger';
import { CreateStoreDto } from '../dto/create-store.dto';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a store',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'updateStore',
      required: true,
      description: 'The new store object',
      type: PartialType(CreateStoreDto),
    }),
    ApiOkResponse({
      description: 'The store was successfully updated',
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
      description: 'Invalid Input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Input.',
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
