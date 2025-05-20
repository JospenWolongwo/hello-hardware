import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { File } from '../entities/file.entity';

export function ApiGetStockImages() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all images by stock ID' }),
    ApiOkResponse({
      description: 'Images retrieved successfully',
      type: File,
      isArray: true,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotFoundResponse({ description: 'No images found for the specified stock ID' })
  );
}
