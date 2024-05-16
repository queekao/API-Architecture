import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('AxiosErrorFilter');
  catch(exception: AxiosError, host: ArgumentsHost): any {
    const httpStatus = exception.response?.status ?? exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const isDevelop = process.env.NODE_ENV === 'development';
    const isInternalServerError = httpStatus >= 500 && httpStatus < 600;
    if (isInternalServerError) {
      if (host.getType() === 'http') {
        this.logger.error(exception, exception.stack);
      }
    }

    const rawMessage = (exception.response?.data as any)?.message ?? exception.response?.data ?? exception.message;
    const message =
      (typeof rawMessage === 'object' ? JSON.stringify(rawMessage) : rawMessage?.toString?.()) ?? '呼叫外部 API 時出錯';
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
        response: isDevelop ? exception.response?.data : undefined,
        stack: isDevelop && isInternalServerError ? exception.stack : undefined,
      });
    }
  }
}
