import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { CartItemService } from '../service/cart-item.service';
import {
  ApiAddProduct,
  ApiDeleteUserCartItem,
  ApiDeleteUserCartItems,
  ApiGetCartItem,
  ApiGetCartItems,
  ApiUpdateCartItem,
} from '../swagger';

@ApiTags('Cart-Items')
@ApiBearerAuth()
@Controller('cart-items')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('accessToken'))
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  private readonly logger = new Logger(CartItemController.name);

  @Post('')
  @ApiAddProduct()
  async addProduct(@Req() req: Request, @Body() addProductDto: CreateCartItemDto) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.cartItemService.addProduct(uid, addProductDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.addProduct.name,
          input: { addProductDto },
          error: error,
        },
        `An error occurred when adding an element to his cart by user with id: '${uid}'.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get(':stockId')
  @ApiGetCartItem()
  async getCartItem(@Param('stockId', new ParseUUIDPipe()) stockId: string, @Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.cartItemService.getCartItem(uid, stockId);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.getCartItem.name,
          param: { stockId },
          error: error,
        },
        `An error occurred when looking for his cartItem by user with id: '${uid}'.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get()
  @ApiGetCartItems()
  async getCartItems(@Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.cartItemService.getCartItemsByUser(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.getCartItems.name,
          error: error,
        },
        `An error occurred when looking for his cartItems by user with id: '${uid}'.`
      );
      throw InternalServerErrorException;
    }
  }

  @Delete(':stockId')
  @ApiDeleteUserCartItem()
  async deleteUserCartItem(@Param('stockId', new ParseUUIDPipe()) stockId: string, @Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      await this.cartItemService.deleteUserCartItem(uid, stockId);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.deleteUserCartItem.name,
          error: error,
        },
        `An error occurred when deleting his cartItem of stock Id '${stockId}' by user with id: '${uid}'.`
      );
      throw InternalServerErrorException;
    }
  }

  @Delete()
  @ApiDeleteUserCartItems()
  async deleteUserCartItems(@Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      await this.cartItemService.deleteUserCartItems(uid, true);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.deleteUserCartItem.name,
          error: error,
        },
        `An error occurred when deleting cartItems of user with id: '${uid}'.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch(':stockId')
  @ApiUpdateCartItem()
  async updateCartItem(
    @Param('stockId', new ParseUUIDPipe()) stockId: string,
    @Body('quantity') quantity: number,
    @Req() req: Request
  ) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.cartItemService.updateCartItem(uid, stockId, quantity);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error(
        {
          function: this.updateCartItem.name,
          param: { stockId, quantity },
          error: error,
        },
        `An error occurred while updating cart item for user: '${uid}' with stockId: '${stockId}'.`
      );
      throw new InternalServerErrorException();
    }
  }
}
