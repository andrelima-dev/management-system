import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { RefreshTokenEntity } from '../tokens/refresh-token.entity';

export type UserRole = 'admin' | 'manager' | 'member';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('users_email_unique', { unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', name: 'display_name', length: 120 })
  displayName!: string;

  @Column({ type: 'varchar', length: 20, default: 'member' })
  role!: UserRole;

  @OneToMany(() => RefreshTokenEntity, token => token.user)
  refreshTokens!: RefreshTokenEntity[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
