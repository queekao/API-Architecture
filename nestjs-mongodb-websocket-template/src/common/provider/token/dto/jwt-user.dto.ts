import { OmitType } from '@nestjs/swagger';
import { JwtUserEntity } from 'src/authorize/entity/jwt-user.entity';

export class JwtUserDto extends OmitType(JwtUserEntity, ['token', 'type', 'exp']) {}
