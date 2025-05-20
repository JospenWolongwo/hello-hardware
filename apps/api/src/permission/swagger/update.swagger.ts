import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  PartialType,
} from '@nestjs/swagger';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Permission } from '../dto/permission.dto';

export function ApiUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an existing permission',
    }),
    ApiOkResponse({
      type: Permission,
      description: 'Successful operation.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid ID value.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed (uuid is expected)',
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
    }),
    ApiNotFoundResponse({
      description: 'Permission was not found',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Permission not found',
        },
      },
    }),
    ApiParam({
      name: 'updatePermissionDto',
      type: PartialType(CreatePermissionDto),
    })
  );
}
