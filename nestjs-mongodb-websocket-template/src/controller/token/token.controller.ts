import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtUserEntity } from 'src/authorize/entity/jwt-user.entity';
import { TokenTransferDto } from './dto/token-transfer.dto';
import { ApiTag } from 'src/common/enum/api-tag.enum';
import { UseApiKey } from 'src/authorize/decorator/use-api-key.decorator';
import { UserService } from 'src/common/provider/user/user.service';
import { TokenService } from 'src/common/provider/token/token.service';
import { TokenGenerateType } from 'src/authorize/enum/token.enum';
import { TemplateNestjsServerService } from 'src/common/provider/template-nestjs-server/template-nestjs-server.service';

@ApiTags(ApiTag.Token)
@Controller('token')
export class TokenController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private templateNestjsServerService: TemplateNestjsServerService,
  ) {}

  @Get('/test-token')
  @ApiOperation({ summary: '獲得測試 token' })
  @ApiResponse({ status: HttpStatus.OK, type: JwtUserEntity })
  @HttpCode(HttpStatus.OK)
  @UseApiKey()
  async getTestToken(): Promise<JwtUserEntity> {
    if (process.env.NODE_ENV !== 'development') {
      throw new HttpException(`僅 dev 允許使用此 API`, HttpStatus.FORBIDDEN);
    }

    const user = await this.userService.findOrCreate({ thirdPartUid: 'test' });
    const token = this.tokenService.generateJwtUserToken({
      ...user,
      generateType: TokenGenerateType.TransferFromThirdPart,
    });

    return this.tokenService.verifyJwtUserToken(token);
  }

  @ApiTags(ApiTag.NoToken)
  @Post('/transfer/third-part-token')
  @ApiOperation({
    summary: '轉換第三方 token 為此微服務 token',
    description: 'Token 的過期時間會和原本的 token 過期時間相同，但不會有永久 token。',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: JwtUserEntity })
  @HttpCode(HttpStatus.CREATED)
  async tokenTransfer(@Body() tokenTransferDto: TokenTransferDto): Promise<JwtUserEntity> {
    const newToken = await this.tokenService.transferUserThirdPartToken(tokenTransferDto.token, (token) => {
      return this.templateNestjsServerService.verifyToken(token);
    });
    console.log(newToken);

    return this.tokenService.verifyJwtUserToken(newToken);
  }
}
