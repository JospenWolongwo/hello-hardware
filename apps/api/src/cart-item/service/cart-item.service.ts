/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockService } from '../../stock/service/stock.service';
import { UserService } from '../../user-management/service/user.service';
import { Repository } from 'typeorm';
import type { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { CartItem } from '../entities/cart-item.entity';
import { SerializedCartItem } from '../types/serializedCartItem.class';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly stockService: StockService,
    private readonly userService: UserService
  ) {}

  private readonly logger = new Logger(CartItemService.name);

  private serializeCartItem(cartItem: CartItem): SerializedCartItem {
    const picturesStorageUrl = process.env.AZURE_BLOB_STORAGE_URL;

    const serializedCartItem = new SerializedCartItem(cartItem);

    // Append the picturesStorageUrl to every picture in the stockItem
    if (serializedCartItem.stockItem.pictures) {
      serializedCartItem.stockItem.pictures = serializedCartItem.stockItem.pictures.map(
        (picture) => `${picturesStorageUrl}${picture}`
      );
    }

    return serializedCartItem;
  }

  async createCartItem(userId: string, createCartItemDto: CreateCartItemDto) {
    this.logger.warn(this.createCartItem.name + ' is triggered');

    const { stockId, quantity } = createCartItemDto;

    try {
      const user = await this.userService.findById(userId);
      const productStock = await this.stockService.findOneByStockId(stockId);

      if (productStock) {
        const newCartItem = this.cartItemRepository.create();
        newCartItem.user = user;
        // update stock quantity on cart item creation
        const updateProductStock = await this.stockService.decreaseQuantity(stockId, quantity);
        newCartItem.stockItem = updateProductStock;
        newCartItem.quantity = quantity;

        const savedCartItem = await this.cartItemRepository.save(newCartItem);

        return savedCartItem;
      }
      const error = new HttpException(`The product stock does not exist.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.createCartItem.name, input: { createCartItemDto } },
        `The product stock with id: '${stockId}' does not exist.`
      );

      throw error;
    } catch (error) {
      throw error;
    }
  }

  async addCartItemQuantity(quantity: number, cartItem: CartItem, stockId: string) {
    this.logger.warn(this.addCartItemQuantity.name + ' is triggered');

    if (quantity > 0) {
      await this.stockService.decreaseQuantity(stockId, quantity);
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);

      return cartItem;
    }
  }

  async addProduct(userId: string, addProductDto: CreateCartItemDto) {
    this.logger.warn(this.addProduct.name + ' is triggered');

    const productStock = await this.stockService.findOneByStockId(addProductDto.stockId);

    if (productStock) {
      const cartItem = await this.findCartItemByUserAndStock(userId, addProductDto.stockId);

      const productStockQuantity = cartItem ? productStock.quantity + cartItem.quantity : productStock.quantity;

      if (productStockQuantity >= addProductDto.quantity) {
        if (cartItem) {
          await this.stockService.increaseQuantity(productStock.id, cartItem.quantity);
          await this.addCartItemQuantity(addProductDto.quantity, cartItem, addProductDto.stockId);
          await this.getCartItemById(cartItem.id);
        } else {
          await this.createCartItem(userId, addProductDto);
        }

        return this.getCartItemsByUser(userId);
      }

      if (productStockQuantity < addProductDto.quantity && productStockQuantity > 0) {
        const error = new HttpException(
          `There is just ${productStock.quantity} ${productStock.product.name} of SKU: ${productStock.keepingUnit} left.`,
          HttpStatus.BAD_REQUEST
        );

        this.logger.error(
          { function: this.addProduct.name, input: { addProductDto } },
          `There is not enough product in stock, ${productStock.quantity} left.`
        );

        throw error;
      }

      if (productStockQuantity === 0) {
        const error = new HttpException(
          `The product ${productStock.product.name} of SKU: ${productStock.keepingUnit} is out of stock.`,
          HttpStatus.BAD_REQUEST
        );

        this.logger.error(
          { function: this.addProduct.name, input: { addProductDto } },
          `The product ${productStock.product.name} of SKU: ${productStock.keepingUnit} is out of stock.`
        );

        throw error;
      }
    }
  }

  async getCartItem(userId: string, stockId: string) {
    this.logger.warn(this.getCartItem.name + ' is triggered');

    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, stockItem: { id: stockId } },
      relations: { stockItem: true },
    });

    if (cartItem) {
      return this.serializeCartItem(cartItem);
    }

    const error = new HttpException(`The cart item was not found.`, HttpStatus.NOT_FOUND);

    this.logger.error(
      { function: this.getCartItemById.name, input: { userId, stockId } },
      `The cart item of stock with id: '${stockId}', belonging to user with id: '${userId}' does not exist.`
    );

    throw error;
  }

  async getCartItemsByUser(userId: string) {
    this.logger.warn(this.getCartItemsByUser.name + ' is triggered');

    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: { stockItem: true },
    });

    return cartItems.map((cartItem) => this.serializeCartItem(cartItem));
  }

  async getAllCartItems() {
    this.logger.warn(this.getAllCartItems.name + ' is triggered');

    const cartItems = await this.cartItemRepository.find({ relations: { user: true, stockItem: true } });

    return cartItems.map((cartItem) => this.serializeCartItem(cartItem));
  }

  async deleteUserCartItem(userId: string, stockId: string) {
    this.logger.warn(this.deleteUserCartItem.name + ' is triggered');

    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, stockItem: { id: stockId } },
      relations: { user: true, stockItem: true },
    });

    if (cartItem) {
      await this.stockService.increaseQuantity(stockId, cartItem.quantity);
      await this.cartItemRepository.remove([cartItem]);
    } else {
      const error = new HttpException(`The cart item was not found.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.deleteUserCartItem.name, input: { userId, stockId } },
        `The cart item of the product stock with id '${stockId}' belonging to this user does not exist.`
      );

      throw error;
    }
  }

  async deleteStockCartItems(stockId: string) {
    this.logger.warn(this.deleteStockCartItems + ' is triggered');

    const cartItems = await this.cartItemRepository.find({
      where: { stockItem: { id: stockId } },
      relations: { stockItem: true },
    });

    await this.cartItemRepository.remove(cartItems);
  }

  async deleteProductCartItems(productId: string) {
    this.logger.warn(this.deleteProductCartItems + ' is triggered');

    const cartItems = await this.cartItemRepository.find({
      where: { stockItem: { product: { id: productId } } },
      relations: { stockItem: { product: true } },
    });

    await this.cartItemRepository.remove(cartItems);
  }

  async deleteUserCartItems(userId: string, updateStockQuantity = false) {
    this.logger.warn(this.deleteProductCartItems + ' is triggered');

    const cartItems = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, stockItem: true },
    });

    if (updateStockQuantity) {
      for (const cartItem of cartItems) {
        await this.stockService.increaseQuantity(cartItem.stockItem.id, cartItem.quantity);
      }
    }

    await this.cartItemRepository.remove(cartItems);
  }

  private async findCartItemByUserAndStock(userId: string, stockId: string) {
    this.logger.warn(this.findCartItemByUserAndStock.name + ' is triggered');

    const cartItem = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, stockItem: { id: stockId } },
      relations: { user: true, stockItem: true },
    });

    return cartItem;
  }

  private async getCartItemById(cartItemId: string) {
    this.logger.warn(this.getCartItemById + ' is triggered');

    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: { user: true, stockItem: true },
    });

    if (!cartItem) {
      const error = new HttpException(`The cart item was not found.`, HttpStatus.NOT_FOUND);

      this.logger.error(
        { function: this.getCartItemById.name, input: { cartItemId } },
        `The cart item with id: '${cartItemId}' does not exist.`
      );

      throw error;
    }

    return cartItem;
  }

  async updateCartItem(userId: string, stockId: string, quantity: number) {
    try {
      const cartItem = await this.findCartItemByUserAndStock(userId, stockId);
      if (!cartItem) {
        throw new HttpException(`Cart item not found.`, HttpStatus.NOT_FOUND);
      }
      if (quantity <= 0) {
        throw new HttpException(`Quantity must be greater than zero.`, HttpStatus.BAD_REQUEST);
      }
      const productStock = await this.stockService.findOneByStockId(stockId);
      if (!productStock) {
        throw new HttpException(`Product stock not found.`, HttpStatus.NOT_FOUND);
      }

      const quantityDifference = quantity - cartItem.quantity;
      if (quantityDifference > 0) {
        // If new quantity is greater, we need to decrease stock
        if (productStock.quantity < quantityDifference) {
          throw new HttpException(
            `Insufficient stock. Only ${productStock.quantity} items left.`,
            HttpStatus.BAD_REQUEST
          );
        }
        await this.stockService.decreaseQuantity(stockId, quantityDifference);
      } else if (quantityDifference < 0) {
        // If new quantity is less, we need to increase stock
        await this.stockService.increaseQuantity(stockId, -quantityDifference);
      }
      // If quantityDifference is 0, no stock adjustment is needed

      cartItem.quantity = quantity;

      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      this.logger.error(
        { function: this.updateCartItem.name, input: { userId, stockId, quantity } },
        `Failed to update cart item quantity for user: '${userId}', stockId: '${stockId}'.`
      );
      throw error;
    }
  }
}
