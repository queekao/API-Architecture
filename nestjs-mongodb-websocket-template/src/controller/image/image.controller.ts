// import {
//   Controller,
//   HttpCode,
//   HttpException,
//   HttpStatus,
//   ParseFilePipeBuilder,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { JwtUser } from 'src/authorize/decorator/jwt-user.decorator';
// import { JwtUserEntity } from 'src/authorize/entity/jwt-user.entity';
// import { ApiFile } from 'src/common/decorator/swagger/api-file.decorator';
// import { ImageBasicEntity } from 'src/common/provider/image/entity/image-basic.entity';
// import { ImageService } from 'src/common/provider/image/image.service';

// @Controller('image')
// export class ImageController {
//   constructor(private imageService: ImageService) {}

//   @Post('/')
//   @ApiOperation({ summary: '新增照片' })
//   @ApiFile('image')
//   @ApiResponse({ status: HttpStatus.CREATED, type: ImageBasicEntity })
//   @UseInterceptors(FileInterceptor('image'))
//   @HttpCode(HttpStatus.CREATED)
//   uploadFile(
//     @JwtUser() jwtUser: JwtUserEntity,
//     @UploadedFile(
//       new ParseFilePipeBuilder()
//         .addFileTypeValidator({ fileType: /jpeg|png/ })
//         .addMaxSizeValidator({ maxSize: 10 * 1000 * 1000 })
//         .build({ errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE }),
//     )
//     file: Express.Multer.File,
//   ): Promise<ImageBasicEntity> {
//     let fileExtension = 'jpg';
//     if (file.mimetype === 'image/jpeg') {
//       fileExtension = 'jpg';
//     } else if (file.mimetype === 'image/png') {
//       fileExtension = 'png';
//     } else {
//       throw new HttpException(`僅允許 Content-Type: image/jpeg | image/png`, HttpStatus.BAD_REQUEST);
//     }

//     return this.imageService.createImage({ fileExtension }, file.buffer);
//   }
// }
