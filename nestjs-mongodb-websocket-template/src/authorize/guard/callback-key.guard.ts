import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CallbackKeyGuard implements CanActivate {
  constructor() {
    if (process.env.CALLBACK_KEY === undefined || process.env.CALLBACK_KEY === '') {
      throw new Error('缺少環境變數 CALLBACK_KEY');
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const apiKey = this.getToken(context);
    if (apiKey !== process.env.CALLBACK_KEY) throw new HttpException('錯誤的 CALL_BACK_KEY', HttpStatus.UNAUTHORIZED);

    return true;
  }

  getToken(context: ExecutionContext): string {
    return this.callbackKeyFromQuery(context);
  }

  private callbackKeyFromQuery(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest<Request>();
    const callbackKey = req.query['key'];
    if (typeof callbackKey !== 'string') {
      throw new HttpException('找無 key', HttpStatus.UNAUTHORIZED);
    }

    return callbackKey;
  }
}
