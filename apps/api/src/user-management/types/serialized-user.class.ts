import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Auth } from '../../auth/entities/auth.entity';
import type { Product } from '../../product/entity/product.entity';
import type { Stock } from '../../stock/entity/stock.entity';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';
import type { UserReview } from '../../user-reviews/entity/user-review.entity';
import { SerializedUserReview } from '../../user-reviews/types/serialized-user-review.class';
import { PhoneNumberDto } from '../dto';
import type { UserEntity } from '../entities/user.entity';
import { Gender } from '../entities/user.entity';

export class SerializedUser {
  @Exclude()
  id: string;

  @ApiProperty({
    example: 'Joe',
  })
  firstName: string;

  @ApiProperty({
    example: 'Stone',
  })
  lastName: string;

  @ApiProperty({
    type: PhoneNumberDto,
    description: 'User phone number details including country code and number',
  })
  @Expose()
  phoneNumber: PhoneNumberDto;

  @ApiProperty({
    example: 'male',
  })
  gender: Gender;

  @ApiProperty({
    example: 'joestone@gmail.com',
  })
  @Expose()
  get email(): string {
    return this.auth.email;
  }

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
  })
  profilePicture: string;

  @ApiProperty({
    type: [SerializedUserReview],
    description: 'List of user reviews',
  })
  @Transform(({ value }) => value.map((review: UserReview) => new SerializedUserReview(review)), { toPlainOnly: true })
  reviews: UserReview[];

  @ApiProperty({
    example: 'joestone@gmail.com',
  })
  @ApiProperty({
    example: ['ReadUsers', 'ReadUser'],
  })
  @Transform(({ value }) => value.permissions)
  permissions: UserPermissionEntity;

  @Exclude()
  auth: Auth;

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  favouriteProducts: Product[];

  @Exclude({ toPlainOnly: true })
  favouriteStocks: Stock[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
