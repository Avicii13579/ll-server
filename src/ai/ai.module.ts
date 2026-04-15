import { Module } from '@nestjs/common';
import { AIModelFactory } from './ai-model.factory';
import { SessionManager } from './services/session.manager';

@Module({
  providers: [AIModelFactory, SessionManager],
  exports: [AIModelFactory, SessionManager], // 导出给其他模块使用
})
export class AIModule {}
