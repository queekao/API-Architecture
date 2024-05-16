import { HttpService } from '@nestjs/axios';
import { ThirdPartAuthEntity } from '../token/entity/third-part-auth.entity';
import { ENV } from 'src/config/environment';
import { firstValueFrom } from 'rxjs';
import { TemplateNestjsAuthEntity } from './entity/template-nestjs-server-auth.entity';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

/** 由 template-nestjs-project 延伸出的主服務 */
@Injectable()
export class TemplateNestjsServerService {
  private logger = new Logger(TemplateNestjsServerService.name);
  constructor(private httpService: HttpService) {}

  private extractTokenExp(token: string): number | undefined {
    const tokenBase64 = token.split('.')[1];
    if (tokenBase64 === undefined) throw new HttpException('Token 解析錯誤', HttpStatus.UNAUTHORIZED);

    const decodeBase64 = JSON.parse(atob(tokenBase64));
    const exp = parseInt(decodeBase64?.exp);
    if (isNaN(exp)) return undefined;
    return exp;
  }

  async verifyToken(token: string): Promise<ThirdPartAuthEntity> {
    const res = await firstValueFrom(
      // send api to main server for verification
      this.httpService.get<TemplateNestjsAuthEntity>(`${ENV.THIRD_PART_SERVER.API.TOKEN_AUTH}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    console.log(res);

    let authEntity!: TemplateNestjsAuthEntity;
    try {
      // will check the dto and return the token?
      authEntity = dtoCheckSync(TemplateNestjsAuthEntity, res.data);
    } catch (err) {
      this.logger.error(err instanceof Error ? err.stack : err);
      throw new HttpException(`主伺服器驗證 API 規格錯誤`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (authEntity.exp === undefined) {
      // 由於某些 template 過於老舊，沒有 exp 屬性，所以此處直接從 jwt token 解碼
      authEntity.exp = this.extractTokenExp(token);
    }

    return dtoCheckSync(ThirdPartAuthEntity, authEntity);
  }
}
