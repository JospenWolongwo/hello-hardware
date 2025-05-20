import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Permission } from '../dto/permission.dto';
export function ApiFindOne() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find  permission by ID',
      description: 'Return a single permission',
    }),
    ApiOkResponse({
      type: Permission,
      description: 'Successful operation.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid ID supplied',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID supplied',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'UnauthorizedException',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Unauthorized access',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Permission was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Permission was not found',
        },
      },
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
    })
  );
}
