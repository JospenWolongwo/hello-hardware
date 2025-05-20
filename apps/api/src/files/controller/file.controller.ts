// src/files/files.controller.ts
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from '../service/file.service';
import {
  ApiDeleteFile,
  ApiGetFile,
  ApiGetProductImages,
  ApiGetStockImages,
  ApiUploadProductImage,
  ApiUploadStockImage,
} from '../swagger';
import { Express } from 'express';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/product/:productId')
  @ApiUploadProductImage()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(@UploadedFile() file: Express.Multer['File'], @Param('productId') productId: string) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    return this.filesService.uploadFile(file, 'product', productId);
  }

  @Post('upload/stock/:stockId')
  @ApiUploadStockImage()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadStockImage(@UploadedFile() file: Express.Multer['File'], @Param('stockId') stockId: string) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    return this.filesService.uploadFile(file, 'stock', undefined, stockId);
  }

  @Get(':fileName')
  @ApiGetFile()
  async getFile(@Param('fileName') fileName: string) {
    return this.filesService.getFile(fileName);
  }

  @Get('product/:productId')
  @ApiGetProductImages()
  async getImagesByProductId(@Param('productId') productId: string) {
    return this.filesService.getImagesByProductId(productId);
  }

  @Get('stock/:stockId')
  @ApiGetStockImages()
  async getImagesByStockId(@Param('stockId') stockId: string) {
    return this.filesService.getImagesByStockId(stockId);
  }

  @Delete(':fileName')
  @ApiDeleteFile()
  async deleteFile(@Param('fileName') fileName: string) {
    await this.filesService.deleteFile(fileName);

    return { message: 'File deleted successfully' };
  }
}
