import { ChatDeepSeek } from '@langchain/deepseek';
import { type Runnable } from '@langchain/core/runnables';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ModelOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

/**
 * AI 模型工厂服务
 * 管理模型+初始化模型
 * 在其他服务中使用：
 *
 * @Injectable()
 * export class QuizService {
 *  constructor(private aiModelFactory: AIModelFactory) {}
 *
 *  async generateQuiz() {
 *    const model = this.aiModelFactory.createDefaultModel()
 *    // 使用 model
 *  }
 * }
 */

@Injectable()
export class AIModelFactory {
  private readonly logger = new Logger(AIModelFactory.name);
  constructor(private configService: ConfigService) {}

  private createModel(overrides: ModelOptions = {}): ChatDeepSeek {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    if (!apiKey) {
      this.logger.warn('DEEPSEEK_API_KEY 不存在');
    }

    return new ChatDeepSeek({
      apiKey: apiKey || 'dummy-key',
      model:
        overrides.model ??
        this.configService.get<string>('DEEPSEEK_MODEL') ??
        'deepseek-chat',
      temperature:
        overrides.temperature ??
        (Number(this.configService.get<string>('DEEPSEEK_TEMPERATURE')) || 0.7),
      maxTokens:
        overrides.maxTokens ??
        (Number(this.configService.get<string>('MAX_TOKENS')) || 4000),
    });
  }

  createDefaultModel(): Runnable {
    return this.createModel() as unknown as Runnable;
  }

  createStableModel(): Runnable {
    return this.createModel({ temperature: 0.3 }) as unknown as Runnable;
  }

  createCreativeModel(): Runnable {
    return this.createModel({ temperature: 0.9 }) as unknown as Runnable;
  }
}
