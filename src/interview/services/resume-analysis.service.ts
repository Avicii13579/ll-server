import { PromptTemplate } from '@langchain/core/prompts';
import { Injectable, Logger } from '@nestjs/common';
import { AIModelFactory } from 'src/ai/ai-model.factory';
import { RESUME_ANALYSIS_PROMPT } from '../prompts/resume-analysis.prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class ResumeAnalysisService {
  private readonly logger = new Logger(ResumeAnalysisService.name);

  constructor(private aiModelFactory: AIModelFactory) {}

  async analyze(resumeContent: string, jobDescription: string) {
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
}
