/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import type { Seeder } from 'typeorm-seeding';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { StockAvailability } from '../../stock/enum/stock-availability.enum';

export class CreateStocks implements Seeder {
  async run(): Promise<void> {
    const stockRepository = getRepository(Stock);
    const productRepository = getRepository(Product);

    // Get all products
    const products = await productRepository.find();

    for (const product of products) {
      // Check if product already has stocks
      const existingStocks = await stockRepository.find({ where: { product } });

      if (existingStocks.length > 0) {
        console.log(`Stocks already exist for product: ${product.name}`);
        continue;
      }

      // Create different stock variations per product
      const stockVariations = [
        {
          quantity: 10,
          price: product.price,
          isAvailable: true,
          keepingUnit: `${product.id}-BLK-1`,
          availabilityStatus: StockAvailability.IN_STOCK,
          characteristics: {
            color: 'Black',
            size: '15.6"',
            material: 'Aluminum',
          },
          pictures: [product.imageUrl],
        },
        {
          quantity: 5,
          price: product.price,
          isAvailable: true,
          keepingUnit: `${product.id}-SIL-1`,
          availabilityStatus: StockAvailability.IN_STOCK,
          characteristics: {
            color: 'Silver',
            size: '15.6"',
            material: 'Aluminum',
          },
          pictures: [product.imageUrl],
        },
        {
          quantity: 15,
          price: product.price * 1.05, // Slightly higher price
          isAvailable: true,
          keepingUnit: `${product.id}-GRY-1`,
          availabilityStatus: StockAvailability.IN_STOCK,
          characteristics: {
            color: 'Space Gray',
            size: '14"',
            material: 'Aluminum',
          },
          pictures: [product.imageUrl],
        },
        {
          quantity: 3,
          price: product.price * 1.1, // Higher price
          isAvailable: true,
          keepingUnit: `${product.id}-BLK-2`,
          availabilityStatus: StockAvailability.IN_STOCK,
          characteristics: {
            color: 'Black',
            size: '13.3"',
            material: 'Carbon Fiber',
          },
          pictures: [product.imageUrl],
        },
        {
          quantity: 7,
          price: product.price * 0.95, // Lower price
          isAvailable: true,
          keepingUnit: `${product.id}-SIL-2`,
          availabilityStatus: StockAvailability.IN_STOCK,
          characteristics: {
            color: 'Silver',
            size: '13.3"',
            material: 'Aluminum',
          },
          pictures: [product.imageUrl],
        },
      ];

      // Save stock variations
      for (const stockData of stockVariations) {
        const stock = new Stock();
        Object.assign(stock, stockData);
        stock.product = product;
        stock.discounts = [];
        stock.description = {
          shortDescription: product.shortDescription,
          longDescription: [product.description],
        };
        await stockRepository.save(stock);
      }

      console.log(`Created stocks for product: ${product.name}`);
    }
  }
}
