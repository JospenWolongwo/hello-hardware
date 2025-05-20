import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import { UserReview } from '../../user-reviews/entity/user-review.entity';
import { AttributeObject } from '../type/attributeObject.type';

@Entity({ name: 'product' })
@Index(['name', 'category'], { unique: true })
@Index(['id', 'category'], { unique: true })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ nullable: true })
  specs: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({ type: 'decimal', nullable: true })
  minPrice: number;

  @Column({ type: 'decimal', nullable: true })
  maxPrice: number;

  @Column({ default: 'XAF' })
  currency: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  gallery: string;

  @Column('simple-array', { nullable: true })
  galleryImages: string[];

  @Column('simple-array', { nullable: true })
  features: string[];

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  labelColor: string;

  @Column({ type: 'boolean', default: false })
  inStock: boolean;

  @Column('simple-json', { name: 'extra_attributes', nullable: true })
  extraAttributes: AttributeObject<Record<string, unknown>>;

  @ManyToOne(() => Category, { nullable: true, eager: true })
  @JoinColumn({ name: 'category', foreignKeyConstraintName: 'FK_Category_has_Products' })
  category: Category;

  @OneToMany(() => Stock, (stock) => stock.product, { cascade: true })
  stocks: Stock[];

  @ManyToMany(() => UserEntity, (user) => user.favouriteProducts)
  @JoinTable({
    name: 'user_favourite_products',
    joinColumn: {
      name: 'product',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  likedBy: UserEntity[];

  @OneToMany(() => UserReview, (review) => review.product, { cascade: true })
  reviews: UserReview[];
}
