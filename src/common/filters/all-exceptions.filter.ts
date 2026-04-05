import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 创建统一异常过滤器
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error: unknown = null;

    // 处理  HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        const rawMessage = responseObj.message;
        if (typeof rawMessage === 'string') {
          message = rawMessage;
        } else if (
          Array.isArray(rawMessage) &&
          typeof rawMessage[0] === 'string'
        ) {
          message = rawMessage[0];
        } else {
          message = '请求失败';
        }
        const rawError = responseObj.error;
        error = rawError !== undefined && rawError !== null ? rawError : null;
      }
    }

    // 其他异常
    else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误';
      this.logger.error(
        `未处理的异常：${exception.message}`,
        exception.stack,
        'AllExceptionsFilter',
      );
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
    );

    // 返回统一格式的错误响应
    const errorResponse = {
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(error != null ? { error } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
