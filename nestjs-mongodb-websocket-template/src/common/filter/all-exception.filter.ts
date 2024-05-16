import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const isDevelop = process.env.NODE_ENV === 'development';
    const isInternalServerError = httpStatus >= 500 && httpStatus < 600;

    let exceptionName = 'INTERNAL_SERVER_ERROR';
    let exceptionMessage: string | undefined = undefined;
    let exceptionStack: string | undefined = undefined;

    if (exception instanceof Error) {
      exceptionName = exception.name;
      exceptionMessage = exception.message;
      exceptionStack = exception.stack;
    }

    this.logger.error(exception, exceptionStack);
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        name: exceptionName,
        message: '伺服器未預期錯誤',
        rawMessage: isDevelop && isInternalServerError ? exceptionMessage : undefined,
        stack: isDevelop && isInternalServerError ? exceptionStack : undefined,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
}
