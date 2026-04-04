import {
  CallHandler,
  ExecutionContext,
  Logger,
  // Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ResponseFormate<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}

// @Injectable()
/**
 * NestInterceptor<T, ResponseFormate<T>> 第一个参数T：进入拦截器时返回的业务数据类型，第二个参数ResponseFormate<T>：离开拦截器时格式化后的数据
 */
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // 将通用的 ExecutionContext 转化到 HTTP这层 获取和 请求相关的 API
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = ctx.getResponse<Response>();
          const responseTime = Date.now() - now;
          this.logger.log(`${method} ${url} ${statusCode} - ${responseTime}ms`);
        },
        error: (err: unknown) => {
          const responseTime = Date.now() - now;
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `${method} ${url} - ${responseTime}ms - ${message}`,
          );
        },
      }),
    );
  }
}
