import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatDeepSeek } from '@langchain/deepseek';

/**
 * 面试 AI 服务
 * 封装 LangChain + DeepSeek 的调用
 */
@Injectable()
export class InterviewAIService {
  constructor(private readonly configService: ConfigService) {}

  private initializeModel(temperature: number = 0.7): ChatDeepSeek {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    const model =
      this.configService.get<string>('DEEPSEEK_MODEL') || 'deepseek-chat';
    const maxTokens = this.configService.get<number>('MAX_TOKENS') || 4000;

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY 不存在');
    }

    // deepseek-chat 非思考模式（生成内容快）  deepseek-reasoner 思考模式（推理能力强）
    return new ChatDeepSeek({
      apiKey,
      model,
      temperature,
      maxTokens,
    });
  }

  // 使用模型
  // async someMethod() {
  //   const model = this.initializeModel(0.7);
  //   // 在链中使用
  // }
}
