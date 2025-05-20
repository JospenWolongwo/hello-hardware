import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { Store } from '../../store/entities/store.entity';
import { UserEntity } from '../../user-management/entities/user.entity';

@Entity({ name: 'store_user' })
export class StoreUser extends BaseEntity {
  @ManyToOne(() => Store, { nullable: true, eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true, eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'inviter' })
  inviter: UserEntity;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}
