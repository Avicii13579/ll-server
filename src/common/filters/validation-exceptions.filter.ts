import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response, Request } from 'express';

function validationDetailList(response: string | object): string[] {
  if (typeof response === 'string') {
    return [response];
  }
  if (response === null || typeof response !== 'object') {
    return [];
  }
  const msg = (response as Record<string, unknown>).message;
  if (Array.isArray(msg)) {
    return msg.filter((m): m is string => typeof m === 'string');
  }
  if (typeof msg === 'string') {
    return [msg];
  }
  return [];
}

// 处理验证异常过滤器
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // 报错统一格式处理
    const details = validationDetailList(exception.getResponse());

    response.status(400).json({
      code: 400,
      message: '数据验证失败',
      error: details,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
