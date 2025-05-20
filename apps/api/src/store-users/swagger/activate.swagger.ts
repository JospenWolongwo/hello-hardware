import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ToggleUserDto } from '../dto/toggle-user.dto';

export function ApiActivate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Activates store users',
      description: 'Activates the users to a store',
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
          message: 'Store user(s) activated successfully',
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
