import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { ParseUUIDPipe } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user?: { sub: string };
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private getUserId(req: AuthenticatedRequest): string {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Missing user context');
    }
    return userId;
  }

  @Get()
  list(@Query('limit') limit?: string, @Query('offset') offset?: string, @Req() req?: AuthenticatedRequest) {
    const userId = this.getUserId(req!);
    return this.notificationsService.list(userId, parseInt(limit ?? '20'), parseInt(offset ?? '0'));
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string, @Req() req?: AuthenticatedRequest) {
    const userId = this.getUserId(req!);
    return this.notificationsService.get(id, userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseUUIDPipe) id: string, @Req() req?: AuthenticatedRequest) {
    const userId = this.getUserId(req!);
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req?: AuthenticatedRequest) {
    const userId = this.getUserId(req!);
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req?: AuthenticatedRequest) {
    const userId = this.getUserId(req!);
    await this.notificationsService.delete(id, userId);
    return { success: true };
  }
}
