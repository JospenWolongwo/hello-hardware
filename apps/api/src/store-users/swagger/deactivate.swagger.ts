import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ToggleUserDto } from '../dto/toggle-user.dto';

export function ApiDeactivate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Deactivates store users',
      description: 'Activates the user(s) to a store',
    }),
    ApiParam({
      name: 'toggleUserDto',
      type: ToggleUserDto,
      required: true,
    }),
    ApiOkResponse({
      description: 'Successful operation',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.OK,
          message: 'Store user(s) deactivated successfully',
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
