import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import type { Address } from '../entity/address.entity';

export class SerializedAddressEntity {
  @ApiProperty({
    example: 'Cameroun',
  })
  country: string;

  @ApiProperty({
    example: 'Douala',
  })
  city: string;

  @ApiProperty({
    example: 'rue PO',
  })
  street: string;

  @ApiProperty({
    example: '232',
  })
  zipCode: string;

  @ApiPropertyOptional({
    example: 'Located near the bakery of ...',
  })
  additionalDescription: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  owner: string;

  @ApiProperty({
    example: '5e7b9538-e9fd-447b-b6b0-083aa12194dd',
  })
  id: string;

  constructor(partial: Partial<Address>) {
    Object.assign(this, partial);
  }
}
