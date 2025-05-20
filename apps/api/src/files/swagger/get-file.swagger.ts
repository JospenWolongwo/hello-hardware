import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function ApiGetFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a file by name.',
      description: 'Retrieve a file by its name from the storage',
    }),
    ApiOkResponse({
      description: 'The file has been successfully retrieved.',
      schema: {
        type: 'string',
        format: 'binary',
      },
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
