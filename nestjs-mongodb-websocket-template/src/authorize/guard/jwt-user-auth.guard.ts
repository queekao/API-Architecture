import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthType } from '../enum/token-auth-type.enum';

@Injectable()
export class JwtUserAuthGuard extends AuthGuard(TokenAuthType.JwtUser) {}
