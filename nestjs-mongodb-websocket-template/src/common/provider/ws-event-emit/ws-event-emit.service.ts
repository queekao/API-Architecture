import { Injectable, Logger } from '@nestjs/common';
import { JwtWsUserEntity } from 'src/authorize/entity/jwt-ws-user.entity';

@Injectable()
export class WsEventEmitService {
  protected logger = new Logger(WsEventEmitService.name);
  constructor() {}

  private logEmit(wsUser: JwtWsUserEntity, eventName: string) {
    this.logger.verbose(`Emit \`${eventName}\` to ${wsUser.id}/${wsUser.thirdPartUid}(${wsUser.socket.id}).`);
  }

  emitHelloWorld(
    wsUser: JwtWsUserEntity,
    // dto: Dto
  ) {
    // dto = dtoCheckSync(Dto, dto)
    wsUser.socket.emit('hello-world', `hello ${wsUser.id}/${wsUser.thirdPartUid}.`);
    this.logEmit(wsUser, 'hello-world');
  }
}
