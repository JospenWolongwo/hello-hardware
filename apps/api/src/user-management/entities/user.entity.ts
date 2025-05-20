import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserPermissionEntity } from '../../user-permissions/entities/user-permission.entity';
import { UserReview } from '../../user-reviews/entity/user-review.entity';
import { PhoneNumberDto } from '../dto/phoneNumber.dto';

export type Gender = 'male' | 'female' | 'other';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({
    name: 'first_name',
    nullable: true,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'json',
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: PhoneNumberDto;

  @Column({
    nullable: true,
  })
  gender: Gender;

  @Column({
    nullable: true,
  })
  profilePicture: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  @JoinColumn({ name: 'auth_id' })
  auth: Auth;

  @OneToOne(() => UserPermissionEntity, (permission) => permission.owner, { eager: true, cascade: true })
  permissions: UserPermissionEntity;

  @ManyToMany(() => Product, (product) => product.likedBy)
  favouriteProducts: Product[];

  @ManyToMany(() => Stock, (stock) => stock.likedBy)
  favouriteStocks: Stock[];

  @OneToMany(() => UserReview, (review) => review.user)
  reviews: UserReview[];
}
