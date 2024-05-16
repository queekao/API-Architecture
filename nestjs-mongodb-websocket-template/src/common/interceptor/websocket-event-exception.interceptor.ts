import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { WsEventException } from '../exception/ws-event.exception';

@Injectable()
export class WebSocketEventExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        throw new WsEventException(context.switchToWs().getPattern(), err);
      }),
    );
  }
}
