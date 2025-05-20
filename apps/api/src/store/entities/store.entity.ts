import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { BaseEntity } from '../../common/model/base.entity';
import { UserEntity } from '../../user-management/entities/user.entity';

@Entity({ name: 'store' })
@Tree('closure-table', {
  closureTableName: 'store',
  ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
  descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
export class Store extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner' })
  owner: UserEntity;

  @TreeChildren()
  branches: Store[];

  @TreeParent()
  parent: Store;

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];
}
