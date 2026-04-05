import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局限流：每 IP 在 windowMs 内最多 max 次请求（防止滥用）
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 时间窗口：15 分钟
      max: 100, // 窗口内每个 IP 最多 100 个请求
      standardHeaders: true, // 响应头：RateLimit-Limit / RateLimit-Remaining / RateLimit-Reset
      legacyHeaders: false,
    }),
  );

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 当有未定义的属性时抛出错误
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true, // 启动隐式转化
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('启动应用失败:', err);
  process.exit(1);
});
