import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { FlattenStore } from './flatten-store';

export class SerializedFlattenStore {
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
    example: ['saker douala', 'saker yaounde', 'saker baffoussam', 'saker bertoua'],
  })
  branches: string[];

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

  constructor(partial: Partial<FlattenStore>) {
    Object.assign(this, partial);
  }
}
