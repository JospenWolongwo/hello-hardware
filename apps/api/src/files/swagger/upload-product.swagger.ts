import { HttpStatus } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiUploadProductImage() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload an image for a product.',
      description: 'Upload an image for a specific product and return the URL of the uploaded image',
    }),
    ApiConsumes('multipart/form-data'),
    ApiCreatedResponse({
      description: 'The image has been successfully uploaded.',
      schema: {
        type: 'object',
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'uploaded_image_filename.jpg',
          url: 'https://<your-azure-storage-account>.blob.core.windows.net/<container-name>/uploaded_image_filename.jpg',
        },
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
    ApiBadRequestResponse({
      description: 'No file provided.',
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No file provided',
        },
      },
    })
  );
}
