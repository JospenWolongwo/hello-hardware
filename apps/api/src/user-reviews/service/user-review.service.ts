import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { UserReviewDTO } from '../dtos/user-review.dto';
import { UserReview } from '../entity/user-review.entity';
import { SerializedUserReview } from '../types/serialized-user-review.class';

@Injectable()
export class UserReviewService {
  constructor(
    @InjectRepository(UserReview)
    private readonly userReviewRepository: Repository<UserReview>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  private readonly logger = new Logger(UserReviewService.name);

  async create(userReviewDTO: UserReviewDTO) {
    const { userId, productId } = userReviewDTO;

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Check if the product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Create the user review
    const newUserReview = this.userReviewRepository.create({ ...userReviewDTO, user, product });
    await this.userReviewRepository.save(newUserReview);

    return new SerializedUserReview(newUserReview);
  }

  async findOne(id: string) {
    const review = await this.userReviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (review) {
      return {
        ...new SerializedUserReview(review),
        userId: review.user.id,
        userName: review.user.firstName,
        userProfilePicture: review.user.profilePicture,
        productId: review.product.id,
        productName: review.product.name,
      };
    }

    const error = new HttpException('User review was not found', HttpStatus.NOT_FOUND);
    this.logger.error({ function: this.findOne.name, input: { id: id } }, `User review with id: ${id} was not found.`);
    throw error;
  }

  async update(id: string, userReviewDTO: UserReviewDTO) {
    const isReviewExisting = await this.findOne(id);

    if (isReviewExisting) {
      await this.userReviewRepository.update(id, userReviewDTO);

      return this.findOne(id);
    }

    const error = new HttpException(`User review with the Id: '${id}' not found.`, HttpStatus.NOT_FOUND);
    this.logger.error(
      { function: this.update.name, input: { id: id, userReviewDTO: userReviewDTO } },
      `User review with id: ${id} was not found.`
    );
    throw error;
  }

  async remove(id: string) {
    const isReviewExisting = await this.findOne(id);

    if (isReviewExisting) {
      await this.userReviewRepository.delete(id);

      return { message: `User review with id: '${id}' has been deleted.` };
    }

    const error = new HttpException(`User review with the Id: '${id}' not found.`, HttpStatus.NOT_FOUND);
    this.logger.error({ function: this.remove.name, input: { id: id } }, `User review with id: ${id} was not found.`);
    throw error;
  }

  async findReviewsByProductId(productId: string): Promise<SerializedUserReview[]> {
    const reviews = await this.userReviewRepository.find({
      where: { product: { id: productId } },
    });

    if (reviews.length === 0) {
      throw new NotFoundException(`No reviews found for product with id: ${productId}`);
    }

    return reviews.map((review) => new SerializedUserReview(review));
  }

  async findOneReviewPerUser(limit: number): Promise<SerializedUserReview[]> {
    try {
      const reviews = await this.userReviewRepository
        .createQueryBuilder('review')
        .innerJoinAndSelect('review.user', 'user')
        .innerJoinAndSelect('review.product', 'product')
        .innerJoinAndSelect('review.stock', 'stock')
        .distinctOn(['user.id'])
        .orderBy('user.id')
        .addOrderBy('review.createdAt', 'DESC')
        .limit(limit)
        .getMany();

      return reviews.map((review) => new SerializedUserReview(review));
    } catch (error) {
      this.logger.error(
        { function: this.findOneReviewPerUser.name, input: { limit } },
        `Error fetching one review per user: ${error.message}`
      );
      throw new HttpException('Error fetching reviews', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
