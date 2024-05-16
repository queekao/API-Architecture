import {
  HttpException,
  HttpStatus,
  Logger,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { AllExceptionsFilter } from 'src/common/filter/all-exception.filter';
import { WebSocketExceptionFilter } from 'src/common/filter/websocket-exception.filter';
import { WebSocketEventExceptionInterceptor } from 'src/common/interceptor/websocket-event-exception.interceptor';
import { WebSocketLoggerInterceptor } from 'src/common/interceptor/websocket-logger.interceptor';
import { TokenService } from 'src/common/provider/token/token.service';
import { WsEventEmitService } from 'src/common/provider/ws-event-emit/ws-event-emit.service';
import { ENV } from 'src/config/environment';
import { Server, Socket } from 'socket.io';
import { JwtWsUserEntity } from 'src/authorize/entity/jwt-ws-user.entity';
import { JwtWsUser } from 'src/authorize/decorator/jwt-ws-user.decorator';

@UsePipes(ValidationPipe)
@UseInterceptors(WebSocketLoggerInterceptor, WebSocketEventExceptionInterceptor)
@UseFilters(AllExceptionsFilter, WebSocketExceptionFilter)
@WebSocketGateway(ENV.WEB_SOCKET_PORT, { cors: '*' })
export class TemplateGateway {
  private readonly logger = new Logger(TemplateGateway.name);
  constructor(
    private tokenService: TokenService,
    private wsEventEmitService: WsEventEmitService,
  ) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    this.logger.verbose(`Client connected: ${client.id}`);

    try {
      // so we should find the token user
      const wsUser = await this.tokenService.verifyJwtWsToken(client);
      client['user'] = wsUser;
      this.logger.verbose(`${client.id} (id/uid) -> ${wsUser.id}/${wsUser.thirdPartUid}`);
    } catch (err) {
      const code = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.log(`${client.id} token error, code: ${code}`);
      if (code >= 500 && code < 600) {
        this.logger.error(err);
      }
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client['user'];
    if (user instanceof JwtWsUserEntity) {
      this.logger.verbose(`Client ${user.id}/${user.thirdPartUid} disconnected: ${client.id}`);
    } else {
      this.logger.verbose(`Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('hello-world')
  async makeCall(
    @JwtWsUser() wsUser: JwtWsUserEntity,
    // @MessageBody() dto: Dto
  ) {
    this.wsEventEmitService.emitHelloWorld(wsUser);
  }
}
