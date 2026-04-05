import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let error: unknown = null;

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
    } else {
      message = '请求失败';
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(error != null ? { error } : {}),
    });
  }
}
