import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// 实际项目中可以使用 redis 替换
export class CatchInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, unknown>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;

    // 缓存 GET 请求
    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = url;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return next.handle().pipe(
      tap((data: unknown) => {
        this.cache.set(cacheKey, data);
      }),
    );
  }
}
