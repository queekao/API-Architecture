import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

// Schema
// 若有多伺服器 token 需轉換，可以額外新增 type 來去處理。
export class TokenTransferDto {
  @Expose()
  @ApiProperty({ example: '', description: '要轉換的目標 token' })
  @IsString()
  token!: string;
}
