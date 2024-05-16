import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, Length, Matches } from 'class-validator';

export class ImageEntity implements Image {
  @Expose()
  @ApiProperty({ example: 1, description: 'image 的 id' })
  @IsNumber()
  id!: string;

  @Expose()
  @ApiProperty({
    example: 'test.jpg',
    description: 'image 的檔名不允許出現「\\」「/」「:」，且結尾必須為 .jpg .jpeg .png',
  })
  @Matches(/^[^\\/:]+\.(png|jpe?g)$/)
  @Length(1, 30)
  @IsString()
  filename!: string;

  @Expose()
  @ApiProperty({ description: '創建時間' })
  @IsDate()
  createdAt!: Date;

  @Expose()
  @ApiProperty({ description: '更新時間' })
  @IsDate()
  updatedAt!: Date;
}
