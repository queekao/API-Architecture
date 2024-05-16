import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Equals, IsEnum, IsInt, IsString } from 'class-validator';
import { UserEntity } from 'src/common/class/database-entity/user.entity';
import { TokenGenerateType, TokenType } from '../enum/token.enum';
import { PrismaSelectFromClass } from 'src/common/provider/prisma/prisma.service';
import { Prisma } from '@prisma/client';

// is this one get the entity from
export class JwtUserEntity extends PickType(UserEntity, ['id', 'thirdPartUid']) {
  @Expose()
  @ApiProperty({
    example: TokenType.User,
    description: 'token 的類型，給誰使用的。避免可以和其他 token 混用',
  })
  @Equals(TokenType.User)
  type!: TokenType.User;

  @Expose()
  @ApiProperty({
    example: TokenGenerateType.TransferFromThirdPart,
    description: 'token 產生方式，會影響能使用的範圍',
  })
  @IsEnum(TokenGenerateType)
  generateType!: TokenGenerateType;

  @Expose()
  @ApiProperty({ example: '', description: 'JwtToken' })
  @IsString()
  token!: string;

  @Expose()
  @ApiProperty({ example: 10000000, description: 'token 過期時間，由 jwt-token 解碼產生' })
  @IsInt()
  exp!: number;

  static getUserSelect() {
    const select: PrismaSelectFromClass<Prisma.UserSelect, JwtUserEntity> = {
      id: true,
      thirdPartUid: true,
    };
    return select;
  }
}
