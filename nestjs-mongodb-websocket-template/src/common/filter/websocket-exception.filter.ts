import { Catch, ArgumentsHost, Logger, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsEventException } from '../exception/ws-event.exception';

@Catch(WsException, HttpException, WsEventException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger('WebsocketExceptionFilter');
  async catch<T extends Error>(
    exception: WsException | HttpException | WsEventException<T> | T,
    host: ArgumentsHost,
  ): Promise<any> {
    const eventName = exception instanceof WsEventException ? exception.eventName : null;
    const err = exception instanceof WsEventException ? exception.error : exception;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isDevelop = process.env.NODE_ENV === 'development';
    const httpStatus = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const isInternalServerError = httpStatus >= 500 && httpStatus < 600;

    if (isInternalServerError) {
      this.logger.error(err, err.stack);
    }

    let message: string | object = '';
    if (exception instanceof WsException) {
      message = exception.message;
      super.catch(err, host);
    } else if (err instanceof HttpException) {
      if (err instanceof BadRequestException) {
        message = (err.getResponse() as any)?.message ?? undefined; // for validation pipes
      }
      if (message === undefined || message === '') message = err.getResponse();

      const newErr = new WsException(`${err.getStatus()}/${eventName}`);
      newErr.stack = err.stack;
      super.catch(newErr, host);
    } else if ((err as any)?.message !== undefined) {
      message = (err as any)?.message;
    }

    if (host.getType() === 'ws' && eventName !== null) {
      const ctx = host.switchToWs();
      const client = ctx.getClient<Socket>();
      this.logger.verbose(`Emit ERROR/${eventName} to ${client.id}`);
      client.emit(`ERROR/${eventName}`, {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        eventName: eventName,
        message: message,
        stack: isDevelop && isInternalServerError ? err.stack : undefined,
      });
    }
  }
}
