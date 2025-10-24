import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { PaginationResult } from './interfaces/pagination-result.interface';
import { TaskEntity } from './task.entity';
import { CommentEntity } from '../comments/comment.entity';
import { HistoryEntryEntity } from '../history/history-entry.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(@Query() query: ListTasksDto): Promise<PaginationResult<TaskEntity>> {
    return this.tasksService.list(query);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const userId = this.resolveUserId(req);
    return this.tasksService.create(dto, userId);
  }

  @Get(':id/comments')
  listComments(@Param('id', ParseUUIDPipe) id: string): Promise<CommentEntity[]> {
    return this.tasksService.getComments(id);
  }

  @Post(':id/comments')
  createComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request
  ) {
    const userId = this.resolveUserId(req);
    return this.tasksService.addComment(id, dto, userId);
  }

  @Get(':id/history')
  history(@Param('id', ParseUUIDPipe) id: string): Promise<HistoryEntryEntity[]> {
    return this.tasksService.getHistory(id);
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<TaskEntity> {
    return this.tasksService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request
  ) {
    const userId = this.resolveUserId(req);
    return this.tasksService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  private resolveUserId(req: Request): string {
    const user = (req as Request & { user?: { sub?: string } }).user;
    if (user?.sub) {
      return user.sub;
    }

    const header = req.headers['x-user-id'];
    if (!header) {
      throw new BadRequestException('Missing user context');
    }

    if (Array.isArray(header)) {
      return header[0];
    }

    return header;
  }
}
