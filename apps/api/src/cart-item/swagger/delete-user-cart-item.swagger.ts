import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function ApiDeleteUserCartItem() {
  return applyDecorators(
    ApiParam({
      name: 'stockId',
      required: true,
      description: 'The product stock ID of the cart item to delete.',
      type: String,
      format: 'uuid',
    }),
    ApiOperation({
      summary: "Delete the user's cart item of a particular product stock id",
    }),
    ApiOkResponse({
      description: "The user's cart item associated to the stock ID was successfully deleted",
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
