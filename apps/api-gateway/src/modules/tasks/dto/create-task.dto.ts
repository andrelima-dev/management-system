import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength
} from 'class-validator';
import type { TaskPriority } from '@jungle/types';
import { TASK_PRIORITY_VALUES } from '../constants';

export class CreateTaskDto {
  @ApiProperty({ minLength: 3, maxLength: 160 })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 date string' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ enum: TASK_PRIORITY_VALUES, enumName: 'TaskPriority' })
  @IsOptional()
  @IsIn(TASK_PRIORITY_VALUES)
  priority?: TaskPriority;

  @ApiPropertyOptional({ type: [String], description: 'UUID of users to assign' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  assigneeIds?: string[];
}
