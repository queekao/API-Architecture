import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');
  catch(exception: HttpException, host: ArgumentsHost): any {
    const httpStatus = exception.getStatus();

    const isDevelop = process.env.NODE_ENV === 'development';
    const isInternalServerError = httpStatus >= 500 && httpStatus < 600;
    if (isInternalServerError) {
      if (host.getType() === 'http') {
        this.logger.error(exception, exception.stack);
      }
    }

    const exceptionRes = exception.getResponse();
    let rawMessage = exceptionRes;
    if ((exceptionRes as any)?.message !== undefined) {
      rawMessage = (exceptionRes as any)?.message;
    }

    const message =
      (typeof rawMessage === 'object' ? JSON.stringify(rawMessage) : rawMessage?.toString?.()) ?? 'API 錯誤';
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      response.status(httpStatus).json({
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: request.url,
        name: exception.name,
        message: message,
        rawMessage: rawMessage !== message ? rawMessage : undefined,
        stack: isDevelop && isInternalServerError ? exception.stack : undefined,
      });
    }
  }
}
