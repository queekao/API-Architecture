import { ExecutionContext, HttpException, HttpStatus, UseGuards, createParamDecorator } from '@nestjs/common';
import { JwtUserEntity } from '../entity/jwt-user.entity';
import { JwtUserAuthGuard } from '../guard/jwt-user-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenGenerateType } from '../enum/token.enum';
import { ApiTag } from 'src/common/enum/api-tag.enum';

export const JwtUser = function (allowGenerateTypeList: TokenGenerateType[] = []) {
  return createParamDecorator(
    (data: unknown, ctx: ExecutionContext): JwtUserEntity => {
      const request = ctx.switchToHttp().getRequest();
      const user: JwtUserEntity = request.user;
      if (user === undefined) {
        throw new HttpException('token 解析時出錯', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (allowGenerateTypeList.length !== 0) {
        if (allowGenerateTypeList.includes(user.generateType) === false) {
          throw new HttpException('token 權限不足', HttpStatus.FORBIDDEN);
        }
      }

      return user;
    },
    [
      (target: any, key: any) => {
        const jwtAuthGuard = UseGuards(JwtUserAuthGuard);
        const apiBearerAuth = ApiBearerAuth();
        const apiTags = ApiTags(ApiTag.User);
        if (allowGenerateTypeList.length !== 0) {
          const apiOperation = ApiOperation({
            description: `僅允許 GenerateType 為 ${allowGenerateTypeList} 的 token`,
          });
          apiOperation(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        }

        apiTags(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        jwtAuthGuard(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
        apiBearerAuth(target, key, Object.getOwnPropertyDescriptor(target, key) as PropertyDescriptor);
      },
    ],
  )();
};
