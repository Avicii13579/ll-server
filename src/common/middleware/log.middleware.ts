import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 接口请求处理顺序：
 * 请求 -> 中间件 -> 守卫 -> 拦截器（前）-> 管道 -> 控制器 -> 拦截器（后）-> 响应
 * 适用于请求预处理：比如：CORS、请求体解析等
 * 时机：路由匹配后
 */

/**
 * 请求拦截，记录到日志里
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const useAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // 开始记录
    this.logger.log(`${method} ${originalUrl}---${ip}---${useAgent}`);

    // 监听完成事件
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const logLevel = statusCode >= 400 ? 'error' : 'log';

      // 记录响应
      this.logger[logLevel](
        `<- ${method} ${originalUrl} ${statusCode} --- ${responseTime}ms ${ip}`,
      );
    });

    next();
  }
}
