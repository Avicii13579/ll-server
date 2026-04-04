import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  // Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';

export interface ResponseFormate<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}
/**
 * 时机：守卫之后，管道之前
 * 适用于：响应转化、日志记录、缓存等
 */

// @Injectable()
/**
 * NestInterceptor<T, ResponseFormate<T>> 第一个参数T：进入拦截器时返回的业务数据类型，第二个参数ResponseFormate<T>：离开拦截器时格式化后的数据
 */
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormate<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormate<T>> {
    // 将通用的 ExecutionContext 转化到 HTTP这层 获取和 请求相关的 API
    const ctx = context.switchToHttp();
    // const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: T): ResponseFormate<T> => {
        // TODO 待测试 空数据处理
        if (data === null || data === undefined) {
          return {
            code: HttpStatus.OK,
            message: '操作成功',
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        // 标准化请求格式
        if (
          typeof data === 'object' &&
          data !== null &&
          'code' in data &&
          'message' in data
        ) {
          return {
            ...(data as Record<string, unknown>),
            timestamp: new Date().toISOString(),
            path: request.url,
          } as ResponseFormate<T>;
        }

        return {
          code: HttpStatus.OK,
          message: '操作成功',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
