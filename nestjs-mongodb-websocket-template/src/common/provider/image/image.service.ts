import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import * as fs from 'fs';
import { Prisma } from '@prisma/client';
import { CreateImageDto } from './dto/create-image.dto';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { ENV } from 'src/config/environment';
import { nanoid } from 'nanoid';
import { ImageBasicEntity } from './entity/image-basic.entity';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  public readonly IMAGE_PATH = join(__dirname, '..', '..', '..', '..', 'static', ENV.IMAGE_FOLDER_NAME);
  constructor(private prismaService: PrismaService) {
    if (ENV.URL.EXPORT_HTTP_URL === undefined) throw new Error('遺失 env.BASE_URL');
    if (ENV.URL.URL_GLOBAL_PREFIX === undefined) throw new Error('遺失 env.GLOBAL_PREFIX');
    if (ENV.URL.URL_STATIC === undefined) throw new Error('遺失 env.URL_STATIC');
    this.checkFolderExist();
  }

  checkFileExist(fileName: string) {
    return fs.existsSync(join(this.IMAGE_PATH, fileName));
  }

  async checkExist<T extends Prisma.ImageSelect>(where: Prisma.ImageWhereUniqueInput, select: T) {
    const image = await this.prismaService.image.findUnique({
      where: where,
      select,
    });

    if (image === null) {
      if (where.id !== undefined && where.filename !== undefined) {
        throw new HttpException(`找無 Image ${where.id}: ${where.filename}`, HttpStatus.NOT_FOUND);
      }
      if (where.id !== undefined) throw new HttpException(`找無 Image (id: ${where.id})`, HttpStatus.NOT_FOUND);
      if (where.filename !== undefined)
        throw new HttpException(`找無 Image (filename: ${where.filename})`, HttpStatus.NOT_FOUND);

      throw new HttpException(`找無 Image ${where}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return image;
  }

  async checkListExist<T extends Prisma.ImageSelect>(where: Prisma.ImageWhereInput, select: T) {
    const imageList = await this.prismaService.image.findMany({
      where,
      select,
    });

    return imageList;
  }

  async createImage(createImageDto: CreateImageDto, buffer: Buffer): Promise<ImageBasicEntity> {
    createImageDto = dtoCheckSync(CreateImageDto, createImageDto);
    const MAX_RETRY_TIME = 10;

    let fileName = nanoid() + '.' + createImageDto.fileExtension;
    let count = 0;
    while (count < MAX_RETRY_TIME) {
      const existImage = await this.prismaService.image.findFirst({
        where: { filename: fileName },
        select: { id: true },
      });

      if (existImage !== null) {
        fileName = nanoid() + '.' + createImageDto.fileExtension;
        count++;
      } else {
        break;
      }
    }
    if (count >= MAX_RETRY_TIME) {
      throw new HttpException('找無可用檔名', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    fs.writeFileSync(join(this.IMAGE_PATH, fileName), buffer);
    const newImage = await this.prismaService.image.create({ data: { filename: fileName } });
    return ImageBasicEntity.fromImageSelect(newImage);
  }

  /** 須注意，會被排程呼叫。 */
  async deleteImage(imageId: number, option: { isSchedule?: boolean } = { isSchedule: false }) {
    option.isSchedule = option.isSchedule ?? false;
    const image = await this.prismaService.image.findFirst({
      where: { id: imageId as any },
      select: { id: true, filename: true },
    });
    if (image === null) {
      throw new HttpException(`找無圖片(id: ${imageId})`, HttpStatus.NOT_FOUND);
    }

    try {
      await this.prismaService.image.delete({ where: { id: imageId as any } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new HttpException(`刪除時出錯。請確定沒有任何地方使用此圖片。`, HttpStatus.FORBIDDEN);
        }
      }
      throw new HttpException(`刪除時出錯`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      this.deleteImageFile(image.filename);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private checkFolderExist() {
    if (fs.existsSync(this.IMAGE_PATH) === false) {
      fs.mkdirSync(this.IMAGE_PATH, { recursive: true });
    }
  }

  getImageFileList(): string[] {
    this.checkFolderExist();
    return fs.readdirSync(this.IMAGE_PATH);
  }

  deleteImageFile(filename: string) {
    const path = join(this.IMAGE_PATH, filename);
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }
}
