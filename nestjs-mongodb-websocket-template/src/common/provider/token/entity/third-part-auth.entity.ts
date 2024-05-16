import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsString, ValidateIf } from 'class-validator';

export class ThirdPartAuthEntity {
  @Expose()
  @ApiProperty({ example: 1, description: '允許傳入數字(非 NaN)，會自動轉換成字串。' })
  @IsString()
  @Transform((params) => (isNaN(params.value) === false ? String(params.value) : params.value))
  id!: string;

  @Expose()
  @ApiProperty({ example: 1690811927, description: 'token 過期時間，由 jwt 解碼出的數值' })
  @ValidateIf((entity, value) => value !== undefined)
  @IsInt()
  exp!: number | undefined;
}
