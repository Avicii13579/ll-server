import { Module } from '@nestjs/common';
import { AIModelFactory } from './ai-model.factory';

@Module({
  providers: [AIModelFactory],
  exports: [AIModelFactory], // 导出给其他模块使用
})
export class AIModule {}
