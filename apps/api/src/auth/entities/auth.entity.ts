import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/model/base.entity';
import { encodeData } from '../../common/utils/helpers.util';
import { UserEntity } from '../../user-management/entities/user.entity';

@Entity({ name: 'authentication' })
export class Auth extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'last_login', nullable: true, type: 'timestamptz' })
  lastLogin: Date;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => UserEntity, (user) => user.auth, { eager: true, cascade: true })
  user: UserEntity;

  @BeforeInsert()
  async setPassword() {
    if (this.password) {
      this.password = encodeData(this.password);
    }
  }
}
