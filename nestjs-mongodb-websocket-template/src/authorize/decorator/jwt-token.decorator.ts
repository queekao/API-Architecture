import { ExecutionContext, HttpException, HttpStatus, UseGuards, createParamDecorator } from '@nestjs/common';
import { JwtUserEntity } from '../entity/jwt-user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtTokenAuthGuard } from '../guard/jwt-token-auth.guard';
import { TokenAuthType } from '../enum/token-auth-type.enum';
import { OrGuards } from 'src/authorize/decorator/or-guard.decorator';
import { ApiTag } from 'src/common/enum/api-tag.enum';

export const JwtToken = function (tokenAuthTypeList: (TokenAuthType | undefined)[]): any {
  return createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUserEntity | undefined => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      if (user === undefined && tokenAuthTypeList.includes(undefined) === false) {
        throw new HttpException('token 解析時出錯', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return user;
    },
    [
      (target: any, key: any) => {
        const orGuards = OrGuards(tokenAuthTypeList);
        const jwtAuthGuard = UseGuards(JwtTokenAuthGuard);
        const apiOperation = ApiOperation({
          description: `允許混合 Token: ${tokenAuthTypeList.map((value) => String(value)).join(', ')}。`,
        });
        const apiBearerAuth = ApiBearerAuth();

        if (tokenAuthTypeList.includes(undefined)) {
          const apiTags = ApiTags(ApiTag.NoToken);
          apiTags(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        }

        orGuards(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        jwtAuthGuard(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        apiOperation(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        apiBearerAuth(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
      },
    ],
  )();
};
