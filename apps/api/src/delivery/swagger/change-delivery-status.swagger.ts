import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateDeliveryStatusDto } from '../dto/update-delivery-status.dto';

export function ApiChangeDeliveryStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change delivery status',
      description: 'Changes a delivery status.',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'ID of the delivery',
      type: String,
      format: 'uuid',
    }),
    ApiParam({
      name: 'updateOrderStatusDto',
      required: true,
      description: 'It must a delivery status.',
      type: UpdateDeliveryStatusDto,
    }),
    ApiOkResponse({
      description: 'The delivery status was successfully changed.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.OK,
          message: 'Delivery has being ${order_status}',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Delivery with id: '${delivery_id}' does not exist.",
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
