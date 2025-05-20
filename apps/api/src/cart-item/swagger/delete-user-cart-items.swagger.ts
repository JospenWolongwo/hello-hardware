import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiDeleteUserCartItems() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete all cart items belonging to a logged in user',
    }),
    ApiOkResponse({
      description: "All the user's cart items were successfully deleted",
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
