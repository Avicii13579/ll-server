import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
  type OpenAPIObject,
} from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

/** Apifox「导入 → OpenAPI」里填的地址：本机服务 + 该路径（与 jsonDocumentUrl 一致） */
const OPENAPI_JSON_PATH = 'openapi.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- @nestjs/swagger DocumentBuilder（tsc 可解析，eslint project 偶发误报） */
  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('ll-server API')
    .setDescription('HTTP API 文档（由 Swagger 根据装饰器与 DTO 生成）')
    .setVersion('1.0')
    // http + bearer 不要写 in: 'header'，否则不符合 OAS3，Swagger/UI 会告警
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: OPENAPI_JSON_PATH,
  });
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

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
