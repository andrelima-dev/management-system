import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [NotificationsModule, RealtimeModule],
  providers: [MessagingService],
  exports: [MessagingService]
})
export class MessagingModule {}
