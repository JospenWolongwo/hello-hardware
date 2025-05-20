import { Column, Entity, Index, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Product } from '../../product/entity/product.entity';
import { Store } from '../../store/entities/store.entity';

@Entity({ name: 'category' })
@Tree('closure-table', {
  closureTableName: 'category',
  ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
  descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
@Index(['name', 'parent'], { unique: true })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @TreeChildren({ cascade: true })
  subCategories: Category[];

  @TreeParent()
  parent: Category;

  @ManyToOne(() => Store, (store) => store.categories)
  store: Store;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
