import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Product } from '../../product/entity/product.entity';

define(Product, () => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.brand = faker.company.name();
  product.specs = faker.commerce.productDescription();
  product.description = faker.commerce.productDescription();
  product.shortDescription = faker.commerce.productDescription();
  product.active = true;
  product.price = parseFloat(faker.commerce.price(100, 1000));
  product.currency = 'XAF';
  product.imageUrl = faker.image.technics();
  product.inStock = true;
  product.label = faker.helpers.arrayElement(['NOUVEAU', 'SALE', '-25% OFF']);
  product.labelColor = faker.helpers.arrayElement(['#2db224', '#2da5f3', '#edd146']);

  return product;
});
