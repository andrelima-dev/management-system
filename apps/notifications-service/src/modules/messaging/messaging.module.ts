import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule {}
