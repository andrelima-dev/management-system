import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';

export type HistoryAction =
  | 'task.created'
  | 'task.updated'
  | 'task.status_changed'
  | 'task.assignee_changed'
  | 'comment.created';

@Entity({ name: 'task_history' })
export class HistoryEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => TaskEntity, task => task.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: TaskEntity;

  @Column({ type: 'varchar', length: 60 })
  action!: HistoryAction;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'uuid', name: 'performed_by_id', nullable: true })
  performedById?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
