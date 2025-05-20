/* eslint-disable max-lines */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ChangeStockQuantityDto, CreateStockDto, LikeProductStockDto, UpdateStockDto } from '../dto';
import { PdfService } from '../service/pdf.service';
import { StockService } from '../service/stock.service';
import {
  ApiChangeQuantity,
  ApiCreate,
  ApiDownloadStockDetails,
  ApiFind,
  ApiGetStocksByProductId,
  ApiGetStocksByProductIds,
  ApiGetStocksByStockIds,
  ApiLikeProductStock,
  ApiUpdate,
} from '../swagger';
@ApiTags('Stocks')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService, private pdfService: PdfService) {}

  private readonly logger = new Logger(StockController.name);

  @Post('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateStock'])
  @ApiCreate()
  async createStock(@Req() req: Request, @Body() createStockDto: CreateStockDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.stockService.create(uid, createStockDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: 'createStock',
          input: { createStockDto: createStockDto },
          error: error,
        },
        `An error occurred when creating a product stock.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewStock'])
  @ApiFind()
  async findAllStock(@Query('pname') productName: string, @Query('pid') pid: string, @Req() req: Request) {
    try {
      const { uid } = <AccountInfo>req.user;

      if (pid) {
        if (productName) {
          return await this.stockService.findByUser(uid, productName, pid);
        }

        return await this.stockService.findByUser(uid, undefined, pid);
      } else {
        if (productName) {
          return await this.stockService.findByUser(uid, productName);
        }

        return await this.stockService.findByUser(uid);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: 'findStock',
          error: error,
        },
        `An error occurred in finding stocks.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch(':id/quantity')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ChangeStockQuantity'])
  @ApiChangeQuantity()
  async changeStockQuantity(
    @Req() req: Request,
    @Body() changeStockQuantityDto: ChangeStockQuantityDto,
    @Param('id', new ParseUUIDPipe()) stockId: string
  ) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.stockService.changeQuantity(uid, stockId, changeStockQuantityDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.changeStockQuantity.name,
          input: { changeStockQuantityDto: changeStockQuantityDto },
          error: error,
        },
        `An error occurred when changing a product stock quantity.`
      );
      throw InternalServerErrorException;
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['UpdateStock'])
  @ApiUpdate()
  async updateStock(
    @Req() req: Request,
    @Body() updateStockDto: UpdateStockDto,
    @Param('id', new ParseUUIDPipe()) stockId: string
  ) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.stockService.update(uid, stockId, updateStockDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      this.logger.error(
        {
          function: this.updateStock.name,
          input: { updateStockDto: updateStockDto },
          error: error,
        },
        `An error occurred when editing a product stock.`
      );
      throw InternalServerErrorException;
    }
  }

  @Get('product/:productId')
  @ApiGetStocksByProductId()
  async getStocksByProductId(@Param('productId', new ParseUUIDPipe()) productId: string) {
    try {
      return await this.stockService.findStocksByProductId(productId);
    } catch (error) {
      this.logger.error(
        {
          function: 'getStocksByProductId',
          productId,
          error,
        },
        `An error occurred when fetching stocks for product.`
      );
      throw new InternalServerErrorException('Failed to fetch stocks for the product');
    }
  }

  @Get('byProducts')
  @ApiGetStocksByProductIds()
  async getStocksByProductIds(
    @Query('productIds', new ParseArrayPipe({ items: String, separator: ',' })) productIds: string[]
  ) {
    try {
      return await this.stockService.findStocksByProductIds(productIds);
    } catch (error) {
      this.logger.error(
        {
          function: 'getStocksByProductIds',
          productIds,
          error,
        },
        `An error occurred when fetching stocks for products.`
      );
      throw new InternalServerErrorException('Failed to fetch stocks for the products');
    }
  }

  @Get('byStockIds')
  @ApiGetStocksByStockIds()
  async getStocksByStockIds(
    @Query('stockIds', new ParseArrayPipe({ items: String, separator: ',' })) stockIds: string[]
  ) {
    try {
      return await this.stockService.findStocksByStockIds(stockIds);
    } catch (error) {
      this.logger.error(
        {
          function: 'getStocksByStockIds',
          stockIds,
          error,
        },
        `An error occurred when fetching stocks for stock IDs.`
      );
      throw new InternalServerErrorException('Failed to fetch stocks for the stock IDs');
    }
  }
  @Patch(':id/liked')
  @UseGuards(AuthGuard('accessToken'))
  @ApiLikeProductStock()
  async appreciateProductStock(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) pid: string,
    @Body() likeProductDto: LikeProductStockDto
  ) {
    const { uid } = <AccountInfo>req.user;

    return await this.stockService.appreciateProductStock(uid, pid, likeProductDto.status);
  }

  @Get(':id/details/pdf')
  @ApiDownloadStockDetails()
  async downloadStockDetails(@Param('id') id: string, @Res() res: Response) {
    try {
      const stock = await this.stockService.findOneByStockId(id);

      if (!stock) {
        this.logger.warn(`Stock with id ${id} not found.`);

        return res.status(404).send('Stock not found');
      }

      this.logger.debug('Stock found, generating PDF...', { stockId: id });
      const pdfBuffer = await this.pdfService.generateStockPdf(stock);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${stock.product.name}-details.pdf"`,
      });

      res.send(pdfBuffer);
    } catch (error) {
      this.logger.error(
        {
          function: 'downloadStockDetails',
          stockId: id,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
        `An error occurred while downloading stock details for stock ID: ${id}`
      );
      res.status(500).send('Failed to generate PDF for stock details');
    }
  }
}
