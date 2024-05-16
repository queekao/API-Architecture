import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ImageService } from 'src/common/provider/image/image.service';
import { PrismaService } from 'src/common/provider/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { ENV } from 'src/config/environment';

@Injectable()
export class ImageTaskService {
  private readonly logger = new Logger(ImageTaskService.name);
  constructor(
    private imageService: ImageService,
    private prismaService: PrismaService,
  ) {}

  /** 會刪除超過一天、且沒被使用的 image */
  @Cron(CronExpression.EVERY_DAY_AT_4AM, { utcOffset: ENV.DEFAULT_TIMEZONE })
  async removeUnusedImage() {
    this.logger.log('Execute removeUnusedImage');
    const imageList = await this.prismaService.image.findMany({
      select: { id: true, filename: true, createdAt: true },
    });
    const nameMapDbImage: { [filename: string]: (typeof imageList)[0] | undefined } = {};
    imageList.forEach((image) => {
      nameMapDbImage[image.filename] = image;
    });

    const dbRemoved: number[] = [];
    const folderRemoved: string[] = [];

    const folderImageNameList = this.imageService.getImageFileList();
    for (let i = 0; i < folderImageNameList.length; i++) {
      const folderImageName = folderImageNameList[i];
      const dbImage = nameMapDbImage[folderImageName];
      if (dbImage === undefined) {
        folderRemoved.push(folderImageName);
        this.imageService.deleteImageFile(folderImageName);
        continue;
      }
      if (dayjs().diff(dbImage.createdAt, 'day') < 1) continue;

      try {
        await this.imageService.deleteImage(dbImage.id as any, { isSchedule: true });
      } catch (err) {
        if (err instanceof HttpException) {
          if (err.getStatus() >= 500) this.logger.error(err);
        } else {
          this.logger.error(err);
        }
        continue;
      }
      dbRemoved.push(dbImage.id as any);
      folderRemoved.push(dbImage.filename);
    }

    const result = { dbRemoved, folderRemoved };
    this.logger.log(`Auto remove unused image: ${JSON.stringify(result)}`);
    return result;
  }
}
