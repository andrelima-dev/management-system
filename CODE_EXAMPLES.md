# 📚 Exemplos Concretos de Código - Jungle Tasks

## Índice
1. [Exemplo: Entity TypeORM](#exemplo-entity-typeorm)
2. [Exemplo: DTO e Validação](#exemplo-dto-e-validação)
3. [Exemplo: Serviço NestJS](#exemplo-serviço-nestjs)
4. [Exemplo: Controlador NestJS](#exemplo-controlador-nestjs)
5. [Exemplo: JWT Guard](#exemplo-jwt-guard)
6. [Exemplo: Componente React](#exemplo-componente-react)
7. [Exemplo: Hook React](#exemplo-hook-react)
8. [Exemplo: RabbitMQ Producer](#exemplo-rabbitmq-producer)
9. [Exemplo: RabbitMQ Consumer](#exemplo-rabbitmq-consumer)
10. [Exemplo: WebSocket Gateway](#exemplo-websocket-gateway)

---

## Exemplo: Entity TypeORM

**Arquivo: `apps/auth-service/src/modules/users/entities/user.entity.ts`**

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RefreshToken } from '../refresh-tokens/refresh-token.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  // Relacionamentos
  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  refreshTokens: RefreshToken[];

  // Método auxiliar
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

**Arquivo: `apps/tasks-service/src/modules/tasks/entities/task.entity.ts`**

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { TaskHistory } from '../history/task-history.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('tasks')
@Index(['createdBy'])
@Index(['status'])
@Index(['priority'])
@Index(['dueDate'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'uuid' })
  createdBy: string; // FK para User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  // Relacionamentos
  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  comments: Comment[];

  @OneToMany(() => TaskHistory, (history) => history.task, { cascade: true })
  histories: TaskHistory[];

  // Métodos auxiliares
  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && this.status !== TaskStatus.DONE;
  }

  canBeCompleted(): boolean {
    return this.status !== TaskStatus.DONE && this.status !== TaskStatus.ARCHIVED;
  }
}
```

---

## Exemplo: DTO e Validação

**Arquivo: `apps/auth-service/src/modules/auth/dtos/register.dto.ts`**

```typescript
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * DTO para registro de novo usuário
 * 
 * Validações:
 * - email: deve ser um email válido
 * - password: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
 * - firstName/lastName: 1 a 100 caracteres
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message: 'Password must contain uppercase, lowercase, number and symbol',
    },
  )
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;
}

/**
 * DTO para login
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * DTO para resposta de autenticação
 */
export class AuthResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

/**
 * DTO para tokens
 */
export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthResponseDto;
}
```

**Arquivo: `apps/tasks-service/src/modules/tasks/dtos/create-task.dto.ts`**

```typescript
import { IsString, IsOptional, IsDateString, IsEnum, MaxLength } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class TaskResponseDto {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(task: any) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.priority = task.priority;
    this.dueDate = task.dueDate;
    this.createdBy = task.createdBy;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}
```

---

## Exemplo: Serviço NestJS

**Arquivo: `apps/auth-service/src/modules/auth/auth.service.ts`**

```typescript
import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, TokenResponseDto, AuthResponseDto } from './dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrar novo usuário
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registering new user: ${registerDto.email}`);

    // Verificar se email já existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Criar usuário
    const user = this.usersRepository.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    await this.usersRepository.save(user);
    this.logger.log(`User registered successfully: ${user.id}`);

    return this.mapUserToDto(user);
  }

  /**
   * Autenticar usuário e retornar tokens
   */
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    this.logger.log(`Login attempt for: ${loginDto.email}`);

    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validar senha
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Gerar tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    this.logger.log(`User logged in successfully: ${user.id}`);

    return {
      accessToken,
      refreshToken,
      user: this.mapUserToDto(user),
    };
  }

  /**
   * Renovar access token usando refresh token
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const accessToken = this.jwtService.sign(
        { sub: payload.sub },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRATION || '15m',
        },
      );

      return { accessToken };
    } catch (error) {
      this.logger.error('Invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Gerar access e refresh tokens
   */
  private async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Mapear User entity para DTO
   */
  private mapUserToDto(user: User): AuthResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };
  }
}
```

---

## Exemplo: Controlador NestJS

**Arquivo: `apps/tasks-service/src/modules/tasks/tasks.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infra/security/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './dtos';
import { TaskStatus, TaskPriority } from './entities/task.entity';

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  /**
   * GET /api/tasks?status=TODO&priority=HIGH&page=1&limit=10
   * Listar todas as tarefas com filtros e paginação
   */
  @Get()
  async listTasks(
    @Request() req,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: TaskPriority,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    this.logger.log(`Listing tasks for user: ${req.user.sub}`);

    const result = await this.tasksService.findAll({
      userId: req.user.sub,
      status,
      priority,
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    });

    return {
      statusCode: HttpStatus.OK,
      data: result.items.map((task) => new TaskResponseDto(task)),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: Math.ceil(result.total / result.limit),
      },
    };
  }

  /**
   * GET /api/tasks/:id
   * Obter uma tarefa específica
   */
  @Get(':id')
  async getTask(@Request() req, @Param('id') id: string) {
    this.logger.log(`Getting task: ${id} for user: ${req.user.sub}`);

    const task = await this.tasksService.findOne(id, req.user.sub);

    return {
      statusCode: HttpStatus.OK,
      data: new TaskResponseDto(task),
    };
  }

  /**
   * POST /api/tasks
   * Criar nova tarefa
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    this.logger.log(`Creating task for user: ${req.user.sub}`);

    const task = await this.tasksService.create(createTaskDto, req.user.sub);

    return {
      statusCode: HttpStatus.CREATED,
      data: new TaskResponseDto(task),
    };
  }

  /**
   * PUT /api/tasks/:id
   * Atualizar tarefa
   */
  @Put(':id')
  async updateTask(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    this.logger.log(`Updating task: ${id} for user: ${req.user.sub}`);

    const task = await this.tasksService.update(id, updateTaskDto, req.user.sub);

    return {
      statusCode: HttpStatus.OK,
      data: new TaskResponseDto(task),
    };
  }

  /**
   * DELETE /api/tasks/:id
   * Deletar tarefa (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Request() req, @Param('id') id: string) {
    this.logger.log(`Deleting task: ${id} for user: ${req.user.sub}`);

    await this.tasksService.delete(id, req.user.sub);

    return {
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  /**
   * POST /api/tasks/:id/comments
   * Adicionar comentário a uma tarefa
   */
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Request() req,
    @Param('id') id: string,
    @Body() { content }: { content: string },
  ) {
    this.logger.log(`Adding comment to task: ${id}`);

    const comment = await this.tasksService.addComment(id, req.user.sub, content);

    return {
      statusCode: HttpStatus.CREATED,
      data: comment,
    };
  }

  /**
   * GET /api/tasks/:id/history
   * Obter histórico de alterações da tarefa
   */
  @Get(':id/history')
  async getTaskHistory(@Request() req, @Param('id') id: string) {
    this.logger.log(`Getting history for task: ${id}`);

    const history = await this.tasksService.getHistory(id, req.user.sub);

    return {
      statusCode: HttpStatus.OK,
      data: history,
    };
  }
}
```

---

## Exemplo: JWT Guard

**Arquivo: `apps/api-gateway/src/infra/security/jwt-auth.guard.ts`**

```typescript
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException('No token provided');
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn(`Authentication failed: ${info?.message || 'Unknown error'}`);
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  private extractTokenFromRequest(request): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      return null;
    }

    return token;
  }
}
```

**Arquivo: `apps/api-gateway/src/infra/security/jwt.strategy.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload validated for user: ${payload.sub}`);

    return {
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
```

---

## Exemplo: Componente React

**Arquivo: `apps/web/src/components/TaskCard.tsx`**

```typescript
import React from 'react';
import { Task, TaskStatus, TaskPriority } from '@jungle/types';
import { cn } from '@jungle/utils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const priorityColor = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  const statusColor = {
    TODO: 'border-gray-300',
    IN_PROGRESS: 'border-blue-500',
    DONE: 'border-green-500',
    ARCHIVED: 'border-gray-500',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;

  return (
    <div className={cn('task-card border-l-4 p-4 bg-white shadow rounded', statusColor[task.status])}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span className={cn('px-2 py-1 rounded text-sm font-semibold', priorityColor[task.priority])}>
          {task.priority}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className={cn('text-sm mb-3', isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500')}>
          📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          {isOverdue && ' (Atrasada)'}
        </div>
      )}

      {/* Status */}
      <div className="mb-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(task.id, e.target.value as TaskStatus)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value={TaskStatus.TODO}>📝 To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>🚀 In Progress</option>
          <option value={TaskStatus.DONE}>✅ Done</option>
          <option value={TaskStatus.ARCHIVED}>📦 Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit?.(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
```

---

## Exemplo: Hook React

**Arquivo: `apps/web/src/hooks/useTasks.ts`**

```typescript
import { useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, TaskStatus } from '@jungle/types';
import { tasksApi } from '../services/api';

export interface UseTasksOptions {
  status?: TaskStatus;
  priority?: string;
  page?: number;
  limit?: number;
}

export const useTasks = (options?: UseTasksOptions) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(options || {});

  // Fetch tarefas
  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.listTasks(filters),
  });

  // Atualizar tarefa
  const updateTaskMutation = useMutation({
    mutationFn: (variables: { id: string; data: Partial<Task> }) =>
      tasksApi.updateTask(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Deletar tarefa
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Criar tarefa
  const createTaskMutation = useMutation({
    mutationFn: (data: Partial<Task>) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Mudar status
  const changeStatus = useCallback(
    (id: string, status: TaskStatus) => {
      updateTaskMutation.mutate({ id, data: { status } });
    },
    [updateTaskMutation],
  );

  return {
    tasks: tasksData?.items || [],
    isLoading,
    error,
    pagination: tasksData?.pagination,
    filters,
    setFilters,
    refetch,
    createTask: (data: Partial<Task>) => createTaskMutation.mutate(data),
    updateTask: (id: string, data: Partial<Task>) =>
      updateTaskMutation.mutate({ id, data }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
    changeStatus,
  };
};
```

---

## Exemplo: RabbitMQ Producer

**Arquivo: `apps/tasks-service/src/messaging/events.producer.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { amqplib, Connection, Channel } from 'amqplib';

export enum EventType {
  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_DELETED = 'task.deleted',
  COMMENT_ADDED = 'task.comment.added',
  ASSIGNED_TO_USER = 'task.assigned',
}

@Injectable()
export class EventsProducer {
  private readonly logger = new Logger(EventsProducer.name);
  private connection: Connection;
  private channel: Channel;

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Declarar exchange
      await this.channel.assertExchange('tasks', 'topic', { durable: true });

      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async publishEvent(eventType: EventType, data: any) {
    try {
      const message = JSON.stringify({
        type: eventType,
        timestamp: new Date().toISOString(),
        data,
      });

      this.channel.publish(
        'tasks', // exchange
        eventType, // routing key
        Buffer.from(message),
        { persistent: true },
      );

      this.logger.log(`Event published: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${eventType}`, error);
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
```

---

## Exemplo: RabbitMQ Consumer

**Arquivo: `apps/notifications-service/src/messaging/events.consumer.ts`**

```typescript
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { NotificationsService } from '../modules/notifications/notifications.service';

@Injectable()
export class EventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsConsumer.name);
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  constructor(private notificationsService: NotificationsService) {}

  async onModuleInit() {
    await this.connect();
    await this.consumeEvents();
  }

  private async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async consumeEvents() {
    try {
      // Declarar exchange
      await this.channel.assertExchange('tasks', 'topic', { durable: true });

      // Criar queue para notificações
      const queue = await this.channel.assertQueue('notifications', { durable: true });

      // Bind queue ao exchange
      await this.channel.bindQueue(queue.queue, 'tasks', 'task.*');

      // Consumir mensagens
      this.channel.consume(queue.queue, async (msg) => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            this.logger.log(`Event received: ${event.type}`);

            // Processar evento
            await this.handleEvent(event);

            // Confirmar consumo
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error('Failed to process event', error);
            this.channel.nack(msg);
          }
        }
      });

      this.logger.log('Event consumer started');
    } catch (error) {
      this.logger.error('Failed to setup event consumer', error);
    }
  }

  private async handleEvent(event: any) {
    switch (event.type) {
      case 'task.created':
        await this.notificationsService.sendTaskCreatedNotification(event.data);
        break;
      case 'task.updated':
        await this.notificationsService.sendTaskUpdatedNotification(event.data);
        break;
      case 'task.comment.added':
        await this.notificationsService.sendCommentAddedNotification(event.data);
        break;
      case 'task.assigned':
        await this.notificationsService.sendTaskAssignedNotification(event.data);
        break;
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
```

---

## Exemplo: WebSocket Gateway

**Arquivo: `apps/api-gateway/src/websocket/notifications.gateway.ts`**

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private jwtService: JwtService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    try {
      // Validar token
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub;

      // Associar socket ao usuário
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(client.id);

      client.data.userId = userId;
      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error('Connection rejected: Invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Enviar notificação para um usuário específico
   */
  sendNotificationToUser(userId: string, notification: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets && sockets.size > 0) {
      this.logger.log(`Sending notification to user: ${userId}`);
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit('notification:new', notification);
      });
    }
  }

  /**
   * Broadcast para todos os usuários
   */
  broadcastNotification(notification: any) {
    this.logger.log('Broadcasting notification to all users');
    this.server.emit('notification:broadcast', notification);
  }

  /**
   * Receber mensagem do cliente
   */
  @SubscribeMessage('notification:mark-read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const userId = client.data.userId;
    this.logger.log(`Marking notification as read: ${data.notificationId} (User: ${userId})`);
    
    // Aqui você poderia chamar um serviço para marcar como lido no BD
    return { success: true };
  }
}
```

---

**Fim dos Exemplos Concretos de Código**

Estes exemplos cobrem os principais padrões usados no projeto. Adapte conforme necessário!
