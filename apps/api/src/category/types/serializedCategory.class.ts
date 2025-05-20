import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Category } from '../entities/category.entity';

export class SerializedCategory {
  @ApiProperty({
    example: 'c26d7ba4-4c72-433a-9d9f-0196a7767230',
  })
  id: string;

  @ApiProperty({
    example: 'men',
  })
  name: string;

  @ApiProperty({
    example: 'clothes for men',
  })
  description: string;

  @ApiProperty({
    examples: {
      parent: {
        id: '9a24965c-df14-4738-bed6-1247fe0d1102',
        name: 'men',
        description: "men's cloth",
      },
      noParent: null,
    },
  })
  @Transform(({ value }) => {
    return value ? { id: value.id, name: value.name, description: value.description } : null;
  })
  parent: Category;

  @ApiProperty({
    example: [
      {
        id: 'c2dde7fc-a723-4eca-a935-93eb238dc869',
        name: 'blazers',
        description: "men's blazers",
        subCategories: [],
        createdAt: '20/12/2012, 12:00:00',
        updatedAt: '06/01/2013, 15:00:00',
      },
    ],
  })
  subCategories: SerializedCategory[];

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2013-07-28T14:08:30.217Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
