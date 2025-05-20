import { OmitType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';

export class ChangeStockQuantityDto extends OmitType(CreateStockDto, [
  'price',
  'characteristics',
  'productId',
  'keepingUnit',
  'discounts',
] as const) {}
