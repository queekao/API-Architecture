import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { WsEventException } from 'src/common/exception/ws-event.exception';
import { TokenService } from 'src/common/provider/token/token.service';
import { Socket } from 'socket.io';

@Injectable()
export class JwtWsUserAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtWsUserAuthGuard.name);
  constructor(@Inject(TokenService) private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      throw new HttpException(`${JwtWsUserAuthGuard.name} 只接受 websocket`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.authWebSocketToken(context);
  }

  async authWebSocketToken(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToWs();
    const pattern = ctx.getPattern();
    const client = ctx.getClient<Socket>();

    try {
      client['user'] = await this.tokenService.verifyJwtWsToken(client);
      return true;
    } catch (err) {
      this.logger.verbose(`Event \`${pattern}\` from client ${client.id} Auth failed - disconnect.`);
      client.disconnect();
      if (err instanceof WsEventException) throw err;
      if (err instanceof Error) throw new WsEventException(pattern, err);
      throw err;
    }
  }
}
