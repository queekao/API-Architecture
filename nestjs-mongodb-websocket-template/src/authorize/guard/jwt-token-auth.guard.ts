import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtUserAuthGuard } from './jwt-user-auth.guard';
import { Reflector } from '@nestjs/core';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenAuthType } from '../enum/token-auth-type.enum';
import { Metadata } from 'src/common/enum/metadata.enum';
import { Request } from 'express';

/**
 * 允許多個 guard 使用
 */
@Injectable()
export class JwtTokenAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtUserAuthGuard: JwtUserAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const orGuards = this.getOrGuards(context);

    let allowAnonymous = false;
    const guardSet = new Set<TokenAuthType>();
    const useGuardList: Array<CanActivate> = [];
    for (let i = 0; i < orGuards.length; i++) {
      const guard = orGuards[i];
      if (guardSet.has(guard)) continue;
      guardSet.add(guard);
      switch (guard) {
        case TokenAuthType.JwtUser:
          useGuardList.push(this.jwtUserAuthGuard);
          break;
        case undefined:
          allowAnonymous = true;
          break;
        default:
          throw new HttpException('路由設置錯誤', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    for (let i = 0; i < useGuardList.length; i++) {
      const guard = useGuardList[i];
      try {
        const result = await this.awaitCanActivate(guard.canActivate(context));
        if (result === true) return true;
      } catch (err) {}
    }

    const request = context.switchToHttp().getRequest<Request>();
    request.user = undefined;
    if (allowAnonymous === false) throw new HttpException(`錯誤或不適用的 token`, HttpStatus.UNAUTHORIZED);
    return allowAnonymous;
  }

  private getOrGuards(context: ExecutionContext) {
    const guards = this.reflector.get<TokenAuthType[]>(Metadata.OrGuard, context.getHandler());
    if (Array.isArray(guards) === false) throw new HttpException('Controller 錯誤', HttpStatus.INTERNAL_SERVER_ERROR);
    return guards;
  }

  private async awaitCanActivate(promise: boolean | Promise<boolean> | Observable<boolean>) {
    let result = await promise;
    if (typeof result !== 'boolean') result = await firstValueFrom(result);
    return result;
  }
}
