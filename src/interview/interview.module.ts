import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { InterviewController } from './interview.controller';
import { InterviewService } from './services/interview.service';
import { EventService } from 'src/common/services/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Interview, InterviewSchema } from './schemas/interview.schema';
import { AIModule } from 'src/ai/ai.module';

@Module({
  imports: [
    AIModule, // 导入 AI 模块
    CommonModule,
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
    ]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService, EventService],
})
export class InterviewModule {}
