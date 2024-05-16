import { SetMetadata } from '@nestjs/common';
import { Metadata } from 'src/common/enum/metadata.enum';
import { TokenAuthType } from 'src/authorize/enum/token-auth-type.enum';

export function OrGuards(
  passportAuthGuardList: (TokenAuthType | undefined)[],
  option = {}, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const orGuards = SetMetadata(Metadata.OrGuard, passportAuthGuardList);

  return orGuards;
}
