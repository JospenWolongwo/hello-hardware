import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { AttributeObject } from '../../product/type/attributeObject.type';

export class CreateDeliveryDto {
  @ApiProperty({
    type: [String],
    description: 'Order Id.',
    example: ['db134e22-8c86-47cc-b892-b959b26b47ca'],
  })
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  @ArrayNotEmpty()
  @Transform(({ value }) => value.map((id: string) => id.trim().toLocaleLowerCase()))
  orderItems: string[];

  @ApiProperty({
    type: String,
    description: "User's address Id for delivery.",
    example: 'db134e22-8c86-47cc-b892-b959b26b47ca',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  deliveryAddressId: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'The delivery charges in $.',
    example: 20.5,
  })
  @IsOptional()
  @IsPositive()
  charges: number;

  @ApiPropertyOptional({
    type: Object,
    description: 'More details about the delivery.',
    example: { paymentMode: 'cashOnDelivery', time: '1:00 pm', day: '12/08/2023' },
  })
  @IsOptional()
  @IsObject()
  details: AttributeObject<Record<string, unknown>>;
}
