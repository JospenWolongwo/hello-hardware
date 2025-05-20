import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchProductsDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsOptional()
  @IsInt()
  page = 1;

  @IsOptional()
  @IsInt()
  size = 10;
}
