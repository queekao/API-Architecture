import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor() {
    if (process.env.API_KEY === undefined || process.env.API_KEY === '') throw new Error('缺少環境變數 API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    const apiKey = this.getToken(context);
    if (apiKey !== process.env.API_KEY) throw new HttpException('錯誤的 API_KEY', HttpStatus.UNAUTHORIZED);

    return true;
  }

  getToken(context: ExecutionContext): string {
    return this.apiKeyFromBearerToken(context);
  }

  private apiKeyFromBearerToken(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest<Request>();
    const bearerToken = req.headers['authorization'];
    if (bearerToken === undefined) throw new HttpException('缺少 API_KEY', HttpStatus.UNAUTHORIZED);
    if (typeof bearerToken !== 'string') throw new HttpException('錯誤的 API_KEY', HttpStatus.UNAUTHORIZED);

    const apiKey = bearerToken.split('Bearer ')[1];
    if (apiKey === undefined) throw new HttpException('缺少 API_KEY', HttpStatus.UNAUTHORIZED);
    return apiKey;
  }
}
