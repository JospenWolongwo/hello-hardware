import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';

export class UpdateStockDto extends PartialType(OmitType(CreateStockDto, ['quantity', 'productId'] as const)) {}
