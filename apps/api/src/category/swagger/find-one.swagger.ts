import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SerializedCategory } from '../types/serializedCategory.class';

export function ApiFindOneCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a store category by ID',
      description: 'Return a single store category with his sub-categories',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the store of the category',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'categoryId',
      required: true,
      description: 'ID of the store category',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Successful operation',
      type: SerializedCategory,
    }),
    ApiNotFoundResponse({
      description: 'The category requested was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category was not found.',
        },
      },
    })
  );
}
