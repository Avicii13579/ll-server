import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { AIModelFactory } from 'src/ai/ai-model.factory';
import { RESUME_QUIZ_PROMPT } from '../prompts/resume-quiz.prompts';
import { RESUME_ANALYSIS_PROMPT } from '../prompts/resume-analysis.prompts';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);
  constructor(
    // @InjectModel(Interview.name) private interviewModel: Model<Interview>,
    private configService: ConfigService,
    private aiModelFactory: AIModelFactory,
  ) {}

  /**
   * 分析简历并生成报告
   * resumeContent: 简历文本内容
   * jobDescription: 岗位要求
   * return 分析结果、工作年限、技能、匹配
   */
  async analyzeResume(resumeContent: string, jobDescription: string) {
    // 创建 prompt 模版
    const prompt = PromptTemplate.fromTemplate(RESUME_ANALYSIS_PROMPT);
    // 获取模型
    const model = this.aiModelFactory.createDefaultModel();
    const parser = new JsonOutputParser();
    // 创建链： Prompt -> 模型 -> 解析器
    const chain = prompt.pipe(model).pipe(parser);

    // 执行链
    try {
      this.logger.log('开始分析简历...');
      // invoke 获取完整接过后返回，stream 实时反馈
      const result = await chain.invoke({
        resume_content: resumeContent,
        job_description: jobDescription,
      });
      this.logger.log('简历分析完成');
      return result;
    } catch (error) {
      this.logger.error('简历分析失败', error);
      throw error;
    }
  }

  // 获取面试信息，关联用户信息
  // async getInterviewsWithUsers() {
  //   return this.interviewModel.find().populate('user_id').exec();
  // }
}
