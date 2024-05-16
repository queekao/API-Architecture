import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtWsUserAuthGuard } from 'src/authorize/guard/jwt-ws-user-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtWsUserEntity } from '../entity/jwt-ws-user.entity';

/**
 * Param decorator for managerPayload
 *
 * Auto Apply method decorator @UseGuard([JwtAuthGuard](../../../auth/guard/jwt-auth.guard.ts))
 *
 * Auto Apply method decorator @{@link ApiBearerAuth})
 */
export const JwtWsUser = function () {
  return createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtWsUserEntity => {
      const client = ctx.switchToWs().getClient();
      const user = client['user'];
      if (user === undefined) {
        throw new HttpException('token 解析時出錯', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return user;
    },
    [
      (target: any, key: any) => {
        const jwtWsAuthGuard = UseGuards(JwtWsUserAuthGuard);
        const apiBearerAuth = ApiBearerAuth();
        jwtWsAuthGuard(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        apiBearerAuth(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
      },
    ],
  )();
};
