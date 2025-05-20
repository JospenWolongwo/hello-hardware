/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import type { Seeder } from 'typeorm-seeding';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { UserReview } from '../../user-reviews/entity/user-review.entity';

export class CreateReviews implements Seeder {
  async run(): Promise<void> {
    const userReviewRepository = getRepository(UserReview);
    const productRepository = getRepository(Product);
    const userRepository = getRepository(UserEntity);
    const stockRepository = getRepository(Stock);

    // Get all products
    const products = await productRepository.find();

    // Get a user for the reviews
    const users = await userRepository.find({ take: 5 });
    if (users.length === 0) {
      console.error('No users found! Reviews need users to be created first.');

      return;
    }

    // Sample review comments and titles
    const reviewSamples = [
      {
        title: 'Excellent Product',
        comment:
          'Great laptop for business use. The battery life is exceptional and performance is top-notch for my development work.',
        rating: 5,
        helpful: 12,
        notHelpful: 2,
      },
      {
        title: 'Good quality but pricey',
        comment: 'Good laptop but a bit expensive compared to similar models. The display is excellent though.',
        rating: 4,
        helpful: 5,
        notHelpful: 1,
      },
      {
        title: 'Decent but has issues',
        comment: 'The performance is decent but I experienced some issues with the keyboard after a few months of use.',
        rating: 3,
        helpful: 8,
        notHelpful: 3,
      },
      {
        title: 'Very satisfied with my purchase',
        comment: 'This product exceeds my expectations. Fast delivery and excellent customer service.',
        rating: 5,
        helpful: 15,
        notHelpful: 0,
      },
      {
        title: 'Not bad for the price',
        comment: 'Reasonable quality for the price point. You get what you pay for.',
        rating: 3,
        helpful: 7,
        notHelpful: 2,
      },
    ];

    for (const product of products) {
      // Check if product already has reviews
      const existingReviews = await userReviewRepository.find({ where: { product } });

      if (existingReviews.length > 0) {
        console.log(`Reviews already exist for product: ${product.name}`);
        continue;
      }

      // Get stocks for this product
      const stocks = await stockRepository.find({ where: { product } });

      // Create 2-4 reviews per product
      const reviewCount = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < reviewCount; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const reviewSample = reviewSamples[Math.floor(Math.random() * reviewSamples.length)];

        const review = new UserReview();
        review.user = user;
        review.product = product;

        // If stocks exist, assign one randomly
        if (stocks.length > 0) {
          review.stock = stocks[Math.floor(Math.random() * stocks.length)];
        }

        review.title = reviewSample.title;
        review.comment = reviewSample.comment;
        review.rating = reviewSample.rating;
        review.verified = Math.random() > 0.3; // 70% chance of being verified
        review.helpful = reviewSample.helpful;
        review.notHelpful = reviewSample.notHelpful;

        // Random date within the last year
        const randomDaysAgo = Math.floor(Math.random() * 365);
        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);
        review.createdAt = reviewDate;

        await userReviewRepository.save(review);
      }

      console.log(`Created ${reviewCount} reviews for product: ${product.name}`);
    }
  }
}
