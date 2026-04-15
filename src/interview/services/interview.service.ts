import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResumeAnalysisService } from './resume-analysis.service';
import { ConversationContinuationService } from './conversation-continuation.service';
import { SessionManager } from 'src/ai/services/session.manager';
import { RESUME_ANALYSIS_SYSTEM_MESSAGE } from '../prompts/resume-analysis.prompts';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);
  constructor(
    // @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    private configService: ConfigService,
    private sessionManager: SessionManager,
    private resumeAnalysisService: ResumeAnalysisService,
    private conversationContinuationService: ConversationContinuationService,
  ) {}

  /**
   * 分析简历并生成报告
   * resumeContent: 简历文本内容
   * jobDescription: 岗位要求
   * return 分析结果、工作年限、技能、匹配
   */
  async analyzeResume(
    userId: string,
    position: string,
    resumeContent: string,
    jobDescription: string,
  ) {
    try {
      // 第一步创建会话
      const systemMessage = RESUME_ANALYSIS_SYSTEM_MESSAGE(position);
      const sessionId = this.sessionManager.createSession(
        userId,
        position,
        systemMessage,
      );

      this.logger.log(`创建会话： ${sessionId}`);

      // 第二部：调用简历分析服务
      const result = await this.resumeAnalysisService.analyze(
        resumeContent,
        jobDescription,
      );

      // 第三部：保存用户输入到会话历史
      this.sessionManager.addMessage(
        sessionId,
        'user',
        `简历内容：${resumeContent}`,
      );

      // 第四部：保存 AI 回答道会话历史
      this.sessionManager.addMessage(
        sessionId,
        'assistant',
        JSON.stringify(result),
      );
      this.logger.log(`简历分析完成，sessionId：${sessionId}`);

      return {
        sessionId,
        analysis: result,
      };
    } catch (error) {
      this.logger.error(`简历分析失败：${error}`);
      throw error;
    }
  }

  // 继续对话
  async continueConversation(
    sessionId: string,
    userQuestion: string,
  ): Promise<string> {
    try {
      // 第一步：添加用户问题道会话历史
      this.sessionManager.addMessage(sessionId, 'user', userQuestion);

      // 第二步：获取对话历史
      const history = this.sessionManager.getRecentMessage(sessionId, 10);

      this.logger.log(
        `继续对话，sessionId：${sessionId}，历史消息数：${history.length}`,
      );

      // 第三步：调用专门的对话继续服务
      const aiResponse =
        await this.conversationContinuationService.continue(history);

      // 第四步：保存AI 的回答到历史
      this.sessionManager.addMessage(sessionId, 'assistant', aiResponse);

      this.logger.log(`继续对话完成，sessionId：${sessionId}`);

      return aiResponse;
    } catch (error) {
      this.logger.error(`继续对话失败：${error}`);
      throw error;
    }
  }
}
