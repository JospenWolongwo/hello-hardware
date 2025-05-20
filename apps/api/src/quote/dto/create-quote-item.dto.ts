import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuoteItemDTO {
  @IsString()
  @IsNotEmpty()
  stockId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price: number;
}
