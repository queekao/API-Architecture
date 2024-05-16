import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, JwtSignOptions } from '@nestjs/jwt';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { TokenGenerateType, TokenType } from 'src/authorize/enum/token.enum';
import { JwtUserDto } from './dto/jwt-user.dto';
import { JwtUserEntity } from 'src/authorize/entity/jwt-user.entity';
import { UserService } from '../user/user.service';
import { ThirdPartAuthEntity } from './entity/third-part-auth.entity';
import { Socket } from 'socket.io';
import { JwtWsUserEntity } from 'src/authorize/entity/jwt-ws-user.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateJwtUserToken(user: JwtUserDto, options?: JwtSignOptions | undefined) {
    user = dtoCheckSync(JwtUserDto, user);

    const token = this.jwtService.sign(
      { ...user, type: TokenType.User } satisfies Omit<JwtUserEntity, 'token' | 'exp'>,
      options,
    );
    console.log(token);

    return token;
  }
  verifyJwtUserToken(userToken: string): JwtUserEntity {
    const decode = this.jwtService.verify(userToken);
    const jwtUserEntity: JwtUserEntity = dtoCheckSync(JwtUserEntity, { ...decode, token: userToken });

    return jwtUserEntity;
  }

  async transferUserThirdPartToken(
    token: string,
    thirdPartTokenVerifyFn: (token: string) => Promise<ThirdPartAuthEntity>,
  ): Promise<string> {
    const thirdPartAuthEntity = dtoCheckSync(ThirdPartAuthEntity, await thirdPartTokenVerifyFn(token));

    const user = await this.userService.findOrCreate({ thirdPartUid: thirdPartAuthEntity.id });
    const tokenExpireAt = thirdPartAuthEntity.exp !== undefined ? new Date(thirdPartAuthEntity.exp * 1000) : undefined;
    // final transfer newToken return JwtToken ? not api_key ?
    const newToken = this.generateJwtUserToken(
      { ...user, generateType: TokenGenerateType.TransferFromThirdPart },
      tokenExpireAt !== undefined
        ? { expiresIn: Math.floor((tokenExpireAt.getTime() - new Date().getTime()) / 1000) }
        : undefined,
    );

    return newToken;
  }

  /**
   * 採 local 端驗證，須通過 WebSocket Controller 去重新產生 token
   * 在進行 WebSocket 連線
   */
  async verifyJwtWsToken(client: Socket): Promise<JwtWsUserEntity> {
    const token = this.extractSocketBearerToken(client);

    try {
      const data = this.jwtService.verify(token);
      return JwtWsUserEntity.verify(JwtWsUserEntity, {
        ...data,
        token: token,
        socket: client,
      });
    } catch (err) {
      if (err instanceof JsonWebTokenError) throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
      throw err;
    }
  }

  extractSocketBearerToken(client: Socket) {
    // const bearerToken = client.handshake.headers.authorization;
    const bearerToken = client.handshake.query.token as string;
    if (bearerToken === undefined) {
      throw new HttpException('找無 token', HttpStatus.UNAUTHORIZED);
    }
    const token = bearerToken.split('Bearer ')[1];
    if (token === undefined) {
      throw new HttpException('必須是 Bearer token', HttpStatus.UNAUTHORIZED);
    }
    return token;
  }
}
