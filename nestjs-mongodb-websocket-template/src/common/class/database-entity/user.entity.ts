import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDate, IsString, Length } from 'class-validator';

// schema
export class UserEntity implements User {
  @Expose()
  @ApiProperty({ example: '1', description: '使用者 id' })
  @IsString()
  @Length(1, 128)
  id!: string;

  @Expose()
  @ApiProperty({ example: '1', description: '第三方使用者 id' })
  @IsString()
  @Length(1, 128)
  thirdPartUid!: string;

  @Expose()
  @ApiProperty({ example: new Date(), description: '創建日期' })
  @IsDate()
  createdAt!: Date;

  @Expose()
  @ApiProperty({ example: new Date(), description: '更新日期' })
  @IsDate()
  updatedAt!: Date;
}
