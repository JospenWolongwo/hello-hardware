import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function ApiFindOne() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find store by ID',
      description: 'Return a single store',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the store',
      type: String,
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Successful operation',
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
          message: 'Invalid input',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'UnauthorizedException',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'UnauthorizedException',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Store was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Store was not found',
        },
      },
    })
  );
}
