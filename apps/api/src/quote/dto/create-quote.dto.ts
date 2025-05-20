import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateQuoteItemDTO } from './create-quote-item.dto';

export class CreateQuoteDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsInt()
  @IsNotEmpty()
  totalItems: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  totalPrice: number;

  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDTO)
  items: CreateQuoteItemDTO[];
}
