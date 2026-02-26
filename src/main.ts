import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 自动移除 DTO 中未定义的属性
      // forbidNonWhitelisted: true, // 当有未定义的属性时抛出错误
      // transform: true, // 自动转换类型
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('启动应用失败:', err);
  process.exit(1);
});
