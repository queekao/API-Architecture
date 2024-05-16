import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { WsEventException } from '../exception/ws-event.exception';
import { sleep } from '../util/timer';

@Injectable()
export class WebSocketLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('WEBSOCKET');
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      map(() => this.showMessage(context, start)),
      catchError(async (err) => this.showErrorMessage(context, start, err)),
    );
  }

  private showMessage(context: ExecutionContext, start: number): void {
    if (context.getType() === 'ws') {
      const end = Date.now();
      const ws = context.switchToWs();
      const client = ws.getClient<Socket>();

      this.logger.log(`SUCCEED - Event \`${ws.getPattern()}\` from client ${client.id} - ${end - start}ms`);
    }
  }

  public async showErrorMessage(context: ExecutionContext, start: number, err: any) {
    let exception = err;
    if (err instanceof WsEventException) {
      exception = err;
      err = err.error;
    }

    if (context.getType() === 'ws') {
      const end = Date.now();
      const ctx = context.switchToWs();
      const client = ctx.getClient<Socket>();

      let status = 'UNKNOWN';
      if (err instanceof HttpException) {
        status = err.getStatus().toString();
      } else if (err instanceof WsException) {
        status = 'WsException';
      }
      await sleep(200); // 讓 error message 先出現。
      this.logger.log(`${status} - Event \`${ctx.getPattern()}\` from client ${client.id} - ${end - start}ms`);
    }

    throw exception;
  }
}
