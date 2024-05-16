import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateImageDto {
  @Expose()
  @ApiProperty({ example: 'jpg', description: '副檔名' })
  @IsString()
  @Length(1, 10)
  fileExtension!: string;
}
