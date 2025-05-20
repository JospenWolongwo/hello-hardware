import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SerializedCategory } from '../types/serializedCategory.class';

export function ApiFindAllCategories() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      required: true,
      description: 'The ID of the store we want the categories',
      type: String,
      format: 'uuid',
    }),
    ApiOperation({
      summary: 'Find all categories of a store',
      description: 'Return all the categories of a store',
    }),
    ApiOkResponse({
      description: 'Successful operation.',
      type: [SerializedCategory],
    })
  );
}
