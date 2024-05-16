import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { Request } from 'express';
import { JwtUserEntity } from '../entity/jwt-user.entity';
import { TokenAuthType } from '../enum/token-auth-type.enum';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, TokenAuthType.JwtUser) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  /** return value will be write into req.user */
  validate(req: Request, payload: Omit<JwtUserEntity, 'token'>): JwtUserEntity {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new HttpException('缺少 token', HttpStatus.UNAUTHORIZED);

    const jwtUserEntity = dtoCheckSync(
      JwtUserEntity,
      { ...payload, token: token },
      { customError: new HttpException('token 內容錯誤，請重新產生 token', HttpStatus.UNAUTHORIZED) },
    );
    return jwtUserEntity;
  }
}
