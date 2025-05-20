import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Category } from '../entities/category.entity';
import type { CategoryInfo } from './category-info.type';

export class FlattenCategory {
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
      },
    ],
  })
  @Expose()
  get categories(): CategoryInfo[] {
    return this.subCategories.map((subCategory) => {
      return { id: subCategory.id, name: subCategory.name, description: subCategory.description };
    });
  }

  @ApiProperty({
    example: '2013-07-28T12:08:30.217Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2013-07-28T14:08:30.217Z',
  })
  updatedAt: Date;

  @Exclude()
  subCategories: Category[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
