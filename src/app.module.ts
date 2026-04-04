import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './common/middleware/log.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
// Nest 应用在启动时调用
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 将中间件应用到所有路由上
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
