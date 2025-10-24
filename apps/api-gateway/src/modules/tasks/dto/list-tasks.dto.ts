import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { TaskPriority, TaskStatus } from '@jungle/types';
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from '../constants';

export class ListTasksDto {
  @ApiPropertyOptional({ description: 'Text to match against title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: TASK_STATUS_VALUES, enumName: 'TaskStatus' })
  @IsOptional()
  @IsIn(TASK_STATUS_VALUES)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TASK_PRIORITY_VALUES, enumName: 'TaskPriority' })
  @IsOptional()
  @IsIn(TASK_PRIORITY_VALUES)
  priority?: TaskPriority;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
