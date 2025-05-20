import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { UserEntity } from '../../user-management/entities/user.entity';
import type { Permission } from '../types/index';

@Entity({ name: 'user_permission' })
export class UserPermissionEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.permissions)
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;

  @Column('simple-array', {
    default: '',
  })
  permissions: Permission[];
}
