import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { InterviewController } from './interview.controller';
import { InterviewService } from './services/interview.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Interview, InterviewSchema } from './schemas/interview.schema';
import { AIModule } from 'src/ai/ai.module';
import { ResumeAnalysisService } from './services/resume-analysis.service';
import { ConversationContinuationService } from './services/conversation-continuation.service';
import {
  ResumeQuizResult,
  ResumeQuizResultSchema,
} from './schemas/interview-quiz-result.schema';
import {
  ConsumptionRecord,
  ConsumptionRecordSchema,
} from './schemas/consumption-record.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { InterviewAIService } from './services/interview-ai.service';
import { DocumentParserService } from './services/document-parser.service';
import {
  AIInterviewResult,
  AIInterviewResultSchema,
} from './schemas/ai-interview-result.schema';

@Module({
  imports: [
    AIModule, // 导入 AI 模块
    CommonModule,
    MongooseModule.forFeature([
      { name: Interview.name, schema: InterviewSchema },
      {
        name: ConsumptionRecord.name,
        schema: ConsumptionRecordSchema,
      },
      { name: ResumeQuizResult.name, schema: ResumeQuizResultSchema },
      { name: User.name, schema: UserSchema },
      { name: AIInterviewResult.name, schema: AIInterviewResultSchema },
    ]),
  ],
  controllers: [InterviewController],
  providers: [
    InterviewService,
    InterviewAIService,
    DocumentParserService,
    ResumeAnalysisService,
    ConversationContinuationService,
  ],
})
export class InterviewModule {}
