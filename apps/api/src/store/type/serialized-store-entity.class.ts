import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { Store } from '../entities/store.entity';

export class SerializedStoreEntity {
  @ApiProperty({
    example: 'c26d7ba4-4c72-433a-9d9f-0196a7767230',
  })
  id: string;

  @ApiProperty({
    example: 'saker',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'the main office of saker in douala',
  })
  description: string;

  @ApiProperty({
    example: {
      name: 'saker bali',
      description: 'the saker office located in bali douala',
      branches: '[]',
    },
  })
  branches: object[];

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  updatedAt: Date;

  @Exclude()
  owner: UserEntity;

  constructor(partial: Partial<Store>) {
    Object.assign(this, partial);
  }
}
