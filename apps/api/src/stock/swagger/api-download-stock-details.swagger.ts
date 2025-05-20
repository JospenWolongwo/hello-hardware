import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function ApiDownloadStockDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Download stock details as PDF',
      description: 'Generates and downloads a PDF containing the details of a specific stock.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      required: true,
      description: 'The ID of the stock to download details for',
    }),
    ApiOkResponse({
      description: 'PDF generated successfully',
    }),
    ApiNotFoundResponse({
      description: 'Stock not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Stock not found',
        },
      },
    })
  );
}
