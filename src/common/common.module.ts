import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';

@Module({
  providers: [EventService],
  exports: [EventService],
})
export class CommonModule {}
