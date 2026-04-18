import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * 接口请求处理顺序：
 * 请求 -> 中间件 -> 守卫 -> 拦截器（前）-> 管道 -> 控制器 -> 拦截器（后）-> 响应
 * 适用于请求预处理：比如：CORS、请求体解析等
 * 时机：路由匹配后
 */

/**
 * 请求拦截，记录到日志里
 */
// 使用 AsyncLocalStorage 来存储 TraceID
// 这样任何地方都能访问到它，而不用传参
export const traceIdStorage = new AsyncLocalStorage<string>();

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TraceIdMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // 从请求头中获取 TraceID，如果没有就生成一个
    const traceId = (req.headers['x-trace-id'] as string) || uuid();

    // 将 TraceID 存储在 AsyncLocalStorage 中
    // 这样 Service 中就能访问到它
    traceIdStorage.run(traceId, () => {
      // 将 TraceID 加到响应头中，前端可以看到
      res.setHeader('x-trace-id', traceId);

      // 记录请求开始
      this.logger.log(`[${traceId}] 请求开始: ${req.method} ${req.url}`);

      // 监听响应完成
      res.on('finish', () => {
        this.logger.log(
          `[${traceId}] 请求结束: ${req.method} ${req.url} - 状态码: ${res.statusCode}`,
        );
      });

      next();
    });
  }
}
