import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { UserEntity } from 'src/common/class/database-entity/user.entity';
import { DtoCheckSyncParameter, dtoCheckSync } from 'src/common/util/dto-check';

export class BaseJwtWsUserEntity extends PickType(UserEntity, ['id', 'thirdPartUid']) {}
export class JwtWsUserEntity extends BaseJwtWsUserEntity {
  @Expose()
  @IsString()
  token!: string;

  socket!: Socket;

  static verify<T extends Pick<JwtWsUserEntity, 'socket'>>(...params: DtoCheckSyncParameter<T, T>) {
    const instance = dtoCheckSync(...params);
    const value = params[1];
    instance.socket = value.socket;

    return instance;
  }
}
