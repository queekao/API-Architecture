import { ApiProperty, PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ImageEntity } from 'src/common/class/database-entity/image.entity';
import { PrismaSelectFromClass } from '../../prisma/prisma.service';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { ENV } from 'src/config/environment';

export class ImageBasicEntity extends PickType(ImageEntity, ['id', 'filename']) {
  @Expose()
  @ApiProperty({ example: `${ENV.URL.EXPORT_IMAGE_URL}/example.jpg`, description: '可以直接存取圖片的 url' })
  @IsString()
  url!: string;

  static getImageSelect() {
    const select: PrismaSelectFromClass<Prisma.ImageSelect, ImageBasicEntity> = {
      id: true,
      filename: true,
    };
    return select;
  }

  static fromImageSelect(
    image: Prisma.ImageGetPayload<{ select: ReturnType<(typeof ImageBasicEntity)['getImageSelect']> }>,
  ) {
    return dtoCheckSync(ImageBasicEntity, {
      ...image,
      url: `${ENV.URL.EXPORT_IMAGE_URL}/${image.filename}`,
    } as any);
  }
}
