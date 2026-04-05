import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { EventService } from 'src/common/services/event.service';

@Module({
  imports: [CommonModule],
  controllers: [InterviewController],
  providers: [InterviewService, EventService],
})
export class InterviewModule {}
