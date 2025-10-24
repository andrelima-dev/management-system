import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { ListTasksDto } from './dto/list-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenPayload } from '../../infra/security/access-token-payload.interface';
import {
  PaginatedTasksResponse,
  TaskCommentResponse,
  TaskHistoryResponse,
  TaskResponse
} from './interfaces/task-responses.interface';

interface AuthenticatedRequest extends Request {
  user: AccessTokenPayload;
}

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks' })
  @ApiOkResponse({ description: 'Paginated list of tasks' })
  list(@Query() query: ListTasksDto): Promise<PaginatedTasksResponse> {
    return this.tasksService.list(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({ description: 'Task created successfully' })
  create(@Body() dto: CreateTaskDto, @Req() req: AuthenticatedRequest): Promise<TaskResponse> {
    const userId = this.getUserId(req);
    return this.tasksService.create(userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve task by id' })
  @ApiOkResponse({ description: 'Task details' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<TaskResponse> {
    return this.tasksService.get(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ description: 'Task updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TaskResponse> {
    const userId = this.getUserId(req);
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete task' })
  @ApiNoContentResponse({ description: 'Task removed successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List comments for a task' })
  @ApiOkResponse({ description: 'Task comments fetched successfully' })
  listComments(@Param('id', ParseUUIDPipe) id: string): Promise<TaskCommentResponse[]> {
    return this.tasksService.listComments(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiCreatedResponse({ description: 'Comment created successfully' })
  createComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthenticatedRequest
  ): Promise<TaskCommentResponse> {
    const userId = this.getUserId(req);
    return this.tasksService.createComment(id, userId, dto);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Retrieve the change history of a task' })
  @ApiOkResponse({ description: 'Task history fetched successfully' })
  listHistory(@Param('id', ParseUUIDPipe) id: string): Promise<TaskHistoryResponse[]> {
    return this.tasksService.listHistory(id);
  }

  private getUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Missing user context');
    }
    return userId;
  }
}
