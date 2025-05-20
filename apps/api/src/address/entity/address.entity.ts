import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';

@Entity({ name: 'address' })
export class Address extends BaseEntity {
  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({
    name: 'additional_description',
    nullable: true,
  })
  additionalDescription: string;

  @Column('uuid')
  owner: string;
}
