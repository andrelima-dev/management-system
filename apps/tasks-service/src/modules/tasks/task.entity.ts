import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { CommentEntity } from '../comments/comment.entity';
import { HistoryEntryEntity } from '../history/history-entry.entity';
import { TaskAssigneeEntity } from './task-assignee.entity';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz', name: 'due_date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'varchar', length: 10, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @Column({ type: 'varchar', length: 20, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Column({ type: 'uuid', name: 'created_by_id' })
  createdById!: string;

  @OneToMany(() => TaskAssigneeEntity, (assignee: TaskAssigneeEntity) => assignee.task, {
    cascade: true
  })
  assignees!: TaskAssigneeEntity[];

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.task, { cascade: true })
  comments!: CommentEntity[];

  @OneToMany(() => HistoryEntryEntity, (entry: HistoryEntryEntity) => entry.task, {
    cascade: true
  })
  history!: HistoryEntryEntity[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  commentsCount?: number;
}
