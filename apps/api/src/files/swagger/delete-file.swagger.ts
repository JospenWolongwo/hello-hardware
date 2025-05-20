import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiDeleteFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a file by name.',
      description: 'Delete a file from the storage by its name',
    }),
    ApiNoContentResponse({
      description: 'File deleted successfully',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized access',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'File not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'File not found',
        },
      },
    })
  );
}
