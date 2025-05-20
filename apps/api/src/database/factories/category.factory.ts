import { define } from 'typeorm-seeding';
import { Category } from '../../category/entities/category.entity';

define(Category, () => {
  const category = new Category();

  return category;
});
