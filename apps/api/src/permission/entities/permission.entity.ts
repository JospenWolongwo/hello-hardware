import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';

@Entity({ name: 'permission' })
export class PermissionEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;
}
