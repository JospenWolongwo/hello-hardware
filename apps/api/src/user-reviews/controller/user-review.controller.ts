import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserReviewDTO } from '../dtos/user-review.dto';
import { UserReviewService } from '../service/user-review.service';
import {
  ApiCreateUserReview,
  ApiDeleteUserReview,
  ApiFindOneUserReview,
  ApiFindReviewsByProductId,
  ApiFindUsersReviews,
  ApiUpdateUserReview,
} from '../swagger/index';
@ApiTags('User Reviews')
@ApiBearerAuth()
@Controller('user-reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class UserReviewController {
  constructor(private readonly userReviewService: UserReviewService) {}

  private readonly defaultReviewQuantity = parseInt(<string>process.env.DEFAULT_REVIEWS_QUANTITY, 10) || 20;

  @Get()
  @ApiFindUsersReviews()
  async findReviews() {
    try {
      const limitNumber = this.defaultReviewQuantity;

      return await this.userReviewService.findOneReviewPerUser(limitNumber);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  @ApiFindOneUserReview()
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.userReviewService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }

  @Post()
  @ApiCreateUserReview()
  async create(@Body() userReviewDTO: UserReviewDTO) {
    try {
      return await this.userReviewService.create(userReviewDTO);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @ApiUpdateUserReview()
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() userReviewDTO: UserReviewDTO) {
    try {
      return await this.userReviewService.update(id, userReviewDTO);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @ApiDeleteUserReview()
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.userReviewService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new InternalServerErrorException();
    }
  }

  @Get('product/:productId')
  @ApiFindReviewsByProductId()
  async findReviewsByProductId(@Param('productId') productId: string) {
    try {
      const reviews = await this.userReviewService.findReviewsByProductId(productId);
      if (!reviews.length) {
        throw new NotFoundException(`No reviews found for product with ID: ${productId}`);
      }

      return reviews;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
