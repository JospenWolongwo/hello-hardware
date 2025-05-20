/* eslint-disable max-lines */
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { SearchProductsDto } from '../../elasticsearch/dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { LikeProductDto } from '../dto/like-product.dto';
import { ToggleProductDto } from '../dto/toggle-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import type { Product } from '../entity/product.entity';
import { ProductService } from '../service/product.service';
import {
  ApiCreate,
  ApiFindAllManagedByUser,
  ApiFindOneByUser,
  ApiFindOneProductById,
  ApiGetAllProducts,
  ApiToggle,
  ApiUpdate,
} from '../swagger';
import { ApiLike } from '../swagger/like-product.swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private readonly logger = new Logger(ProductController.name);
  private readonly defaultProductQuantity = parseInt(<string>process.env.DEFAULT_PRODUCT_QUANTITY, 10) || 50;

  @Post('managed-products')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateProduct'])
  @ApiCreate()
  async createProduct(@Req() req: Request, @Body() createProductDto: CreateProductDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.productService.create(uid, createProductDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: 'createProduct',
          input: { createProductDto: createProductDto },
          error: error,
        },
        `An error occurred when creating a product.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('managed-products')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewProducts'])
  @ApiFindAllManagedByUser()
  async findAllProductsManagedByUser(@Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.productService.findAllManagedByUser(uid);
    } catch (error) {
      this.logger.error(
        {
          function: 'findAllProductsManagedByUser',
          error: error,
        },
        `An error occurred when retrieving all products`
      );

      throw InternalServerErrorException;
    }
  }

  @Get('managed-products/:id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewProduct'])
  @ApiFindOneByUser()
  async findOneProductManagedByUser(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.productService.findOneByUser(id, uid);
    } catch (error) {
      this.logger.error(
        {
          function: 'findOneProductManagedByUser',
          error: error,
        },
        `An error occurred when retrieving a product.`
      );

      throw InternalServerErrorException;
    }
  }

  @Patch('managed-products/:id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['EditProduct'])
  @ApiUpdate()
  async updateProduct(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) updateProductDto: UpdateProductDto
  ) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.productService.update(id, uid, updateProductDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: 'updateProduct',
          input: { updateProductDto: updateProductDto },
          error: error,
        },
        `An error occurred when updating a product.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch('products/:id/liked')
  @UseGuards(AuthGuard('accessToken'))
  @ApiLike()
  async appreciateProduct(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) pid: string,
    @Body() likeProductDto: LikeProductDto
  ) {
    const { uid } = <AccountInfo>req.user;

    return await this.productService.appreciateProduct(uid, pid, likeProductDto.status);
  }

  @Patch('managed-products/status')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['EditProduct'])
  @ApiToggle()
  async toggleProduct(@Req() req: Request, @Body() toggleProductDto: ToggleProductDto) {
    const { uid } = <AccountInfo>req.user;
    try {
      await this.productService.toggleProducts(uid, toggleProductDto);

      const responseMessage = toggleProductDto.status
        ? 'Product(s) activated successfully'
        : 'Product(s) de-activated successfully';

      return { message: responseMessage, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.toggleProduct.name,
          input: { toggleProductDto: toggleProductDto },
          error: error,
        },
        `An error occurred when activating product(s).`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('products')
  @ApiGetAllProducts()
  async getProducts(@Query('limit') limit?: string) {
    try {
      // Default to 50 products if no limit is provided
      const limitNumber = limit !== undefined ? parseInt(limit, 10) : this.defaultProductQuantity;

      return await this.productService.findProducts(limitNumber);
    } catch (error) {
      this.logger.error(
        {
          function: 'getAllProducts',
          error: error,
        },
        `An error occurred when retrieving all products.`
      );
      throw new InternalServerErrorException();
    }
  }

  @Get('product/:id')
  @ApiFindOneProductById()
  async getProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: 'getProductById',
          input: { id: id },
          error: error,
        },
        `An error occurred when retrieving the product with id '${id}'.`
      );
      throw new InternalServerErrorException();
    }
  }

  @Post('search/products')
  async searchProducts(
    @Body() searchParams: SearchProductsDto // Receive query, page, size from the body
  ): Promise<Product[]> {
    const { query, page = 1, size = 10 } = searchParams;

    // Check if the query is valid
    if (!query || query.trim() === '') {
      throw new BadRequestException('Query parameter is required.');
    }

    return this.productService.searchProducts(query, page, size);
  }
}
