import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity, TaskPriority, TaskStatus } from './task.entity';
import { TaskAssigneeEntity } from './task-assignee.entity';
import { CommentEntity } from '../comments/comment.entity';
import { HistoryEntryEntity, HistoryAction } from '../history/history-entry.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { MessagingService } from '../../messaging/messaging.service';
import { PaginationResult } from './interfaces/pagination-result.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(TaskAssigneeEntity)
    private readonly assigneeRepository: Repository<TaskAssigneeEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    @InjectRepository(HistoryEntryEntity)
    private readonly historyRepository: Repository<HistoryEntryEntity>,
    private readonly messagingService: MessagingService
  ) {}

  async list(query: ListTasksDto, userId?: string): Promise<PaginationResult<TaskEntity>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;

    const qb = this.tasksRepository
      .createQueryBuilder('task')
      .orderBy('task.createdAt', 'DESC');

    // Filter by user if provided
    if (userId) {
      qb.andWhere('task.createdById = :userId', { userId });
    }

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.search) {
      qb.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [items, total]: [TaskEntity[], number] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

  const hydrated = await Promise.all(items.map(item => this.getById(item.id)));

  return { items: hydrated, total, page, pageSize };
  }

  async getById(id: string): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: {
        assignees: true,
        comments: true,
        history: true
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(dto: CreateTaskDto, authorId: string): Promise<TaskEntity> {
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      createdById: authorId
    });

    const created = await this.tasksRepository.save(task);
    await this.syncAssignees(created.id, dto.assigneeIds);
    await this.recordHistory(created.id, 'task.created', { title: dto.title }, authorId);
    // Publica evento conforme README: task:created, com dados úteis aos consumidores
    await this.messagingService.publish('task:created', {
      id: created.id,
      title: created.title,
      assigneeIds: dto.assigneeIds ?? []
    });

    return this.getById(created.id);
  }

  async update(id: string, dto: UpdateTaskDto, authorId: string): Promise<TaskEntity> {
    const task = await this.getById(id);
    const historyPayload: { action: HistoryAction; metadata?: Record<string, unknown> }[] = [];

    if (dto.title && dto.title !== task.title) {
      historyPayload.push({ action: 'task.updated', metadata: { field: 'title', value: dto.title } });
      task.title = dto.title;
    }

    if (dto.description !== undefined && dto.description !== task.description) {
      historyPayload.push({
        action: 'task.updated',
        metadata: { field: 'description', value: dto.description }
      });
      task.description = dto.description;
    }

    if (dto.dueDate) {
      const newDueDate = new Date(dto.dueDate);
      if (!Number.isFinite(newDueDate.getTime())) {
        throw new BadRequestException('Invalid due date');
      }
      task.dueDate = newDueDate;
      historyPayload.push({ action: 'task.updated', metadata: { field: 'dueDate', value: dto.dueDate } });
    }

    if (dto.priority && dto.priority !== task.priority) {
      task.priority = dto.priority;
      historyPayload.push({
        action: 'task.updated',
        metadata: { field: 'priority', value: dto.priority }
      });
    }

    if (dto.status && dto.status !== task.status) {
      task.status = dto.status;
      historyPayload.push({ action: 'task.status_changed', metadata: { status: dto.status } });
    }

    await this.tasksRepository.save(task);

    if (dto.assigneeIds !== undefined) {
      const currentAssigneeIds = (task.assignees ?? []).map(assignee => assignee.userId);
      const sortedCurrent = [...currentAssigneeIds].sort();
      const sortedIncoming = [...dto.assigneeIds].sort();
      const changed =
        sortedCurrent.length !== sortedIncoming.length ||
        sortedCurrent.some((value, index) => value !== sortedIncoming[index]);

      if (changed) {
        await this.syncAssignees(id, dto.assigneeIds);
        historyPayload.push({
          action: 'task.assignee_changed',
          metadata: { assigneeIds: dto.assigneeIds }
        });
      }
    }

    if (historyPayload.length > 0) {
      await Promise.all(
        historyPayload.map(entry =>
          this.recordHistory(id, entry.action, entry.metadata, authorId)
        )
      );
      // Publica evento conforme README: task:updated
      await this.messagingService.publish('task:updated', {
        id,
        title: task.title,
        assigneeIds: (task.assignees ?? []).map(a => a.userId),
        actions: historyPayload.map(entry => entry.action)
      });
    }

    return this.getById(id);
  }

  async remove(id: string): Promise<void> {
    await this.assertTaskExists(id);
  await this.tasksRepository.delete(id);
  // Evento de deleção não é exigido no README; mantendo apenas persistência.
  }

  async addComment(taskId: string, dto: CreateCommentDto, authorId: string): Promise<CommentEntity> {
    await this.assertTaskExists(taskId);
    const comment = this.commentsRepository.create({
      task: { id: taskId } as TaskEntity,
      authorId,
      content: dto.content
    });
    const saved = await this.commentsRepository.save(comment);

    await this.recordHistory(taskId, 'comment.created', { commentId: saved.id }, authorId);
    // Publica evento conforme README: comment:new
    await this.messagingService.publish('comment:new', {
      taskId,
      commentId: saved.id,
      authorId
    });

    return saved;
  }

  async getHistory(taskId: string): Promise<HistoryEntryEntity[]> {
    await this.assertTaskExists(taskId);
    return this.historyRepository.find({
      where: { task: { id: taskId } },
      order: { createdAt: 'DESC' }
    });
  }

  async getComments(taskId: string): Promise<CommentEntity[]> {
    await this.assertTaskExists(taskId);
    return this.commentsRepository.find({
      where: { task: { id: taskId } },
      order: { createdAt: 'DESC' }
    });
  }

  private async syncAssignees(taskId: string, assigneeIds: string[] = []): Promise<void> {
    await this.assigneeRepository
      .createQueryBuilder()
      .delete()
      .where('task_id = :taskId', { taskId })
      .execute();

  const uniqueAssignees = Array.from(new Set(assigneeIds));

    if (!uniqueAssignees.length) {
      return;
    }

    const assignees = uniqueAssignees.map(userId =>
      this.assigneeRepository.create({
        userId,
        task: { id: taskId } as TaskEntity
      })
    );
    await this.assigneeRepository.save(assignees);
  }

  private async recordHistory(
    taskId: string,
    action: HistoryAction,
    metadata: Record<string, unknown> | undefined,
    performedById?: string
  ) {
    const entry = this.historyRepository.create({
      task: { id: taskId } as TaskEntity,
      action,
      metadata,
      performedById
    });
    await this.historyRepository.save(entry);
  }

  private async assertTaskExists(taskId: string): Promise<void> {
    const exists = await this.tasksRepository.exist({ where: { id: taskId } });
    if (!exists) {
      throw new NotFoundException('Task not found');
    }
  }

  // ============= Métodos adicionais para Microservices =============

  async findById(id: string): Promise<TaskEntity> {
    return this.getById(id);
  }

  async findAll(): Promise<TaskEntity[]> {
    return this.tasksRepository.find({
      relations: {
        assignees: true,
        comments: true,
        history: true
      },
      order: { createdAt: 'DESC' }
    });
  }

  async delete(id: string, authorId: string): Promise<void> {
    const task = await this.getById(id);
    await this.remove(id);
  }

  async getByUser(userId: string, filters?: { status?: string; priority?: string }): Promise<TaskEntity[]> {
    const qb = this.tasksRepository.createQueryBuilder('task')
      .where('task.createdById = :userId', { userId });

    if (filters?.status) {
      qb.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      qb.andWhere('task.priority = :priority', { priority: filters.priority });
    }

  const tasks: TaskEntity[] = await qb.orderBy('task.createdAt', 'DESC').getMany();
  return Promise.all(tasks.map((task: TaskEntity) => this.getById(task.id)));
  }

  async updateStatus(taskId: string, status: TaskStatus, authorId: string): Promise<TaskEntity> {
    const task = await this.getById(taskId);
    const oldStatus = task.status;
    task.status = status;
    await this.tasksRepository.save(task);
    await this.recordHistory(taskId, 'task.status_changed', { oldStatus, newStatus: status }, authorId);
    // Publica evento conforme README: task:updated
    await this.messagingService.publish('task:updated', {
      id: taskId,
      title: task.title,
      assigneeIds: (task.assignees ?? []).map(a => a.userId),
      oldStatus,
      newStatus: status
    });
    return task;
  }
}
