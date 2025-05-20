import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { ProductModule } from '../product/product.module';
import { UserEntity } from '../user-management/entities/user.entity';
import { UserModule } from '../user-management/user.module';
import { UserReviewController } from './controller/user-review.controller';
import { UserReview } from './entity/user-review.entity';
import { UserReviewService } from './service/user-review.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserReview, Product, UserEntity]), UserModule, ProductModule],
  controllers: [UserReviewController],
  providers: [UserReviewService, ValidationPipe],
  exports: [UserReviewService],
})
export class UserReviewsModule {}
