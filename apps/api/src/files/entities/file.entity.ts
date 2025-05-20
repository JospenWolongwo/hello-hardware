import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FileType } from '../types/file.type';

@Entity({ name: 'file' })
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['product', 'stock', 'profile-picture'] })
  type: FileType;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  stockId?: string;

  @Column({ nullable: true })
  userId?: string;
}
