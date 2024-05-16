import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FindOrCreateUserDto } from './dto/find-or-create-user.dto';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /** 若已存在，則會直接回傳已存在使用者 */
  async findOrCreate(findOrCreateUserDto: FindOrCreateUserDto): Promise<User> {
    findOrCreateUserDto = dtoCheckSync(FindOrCreateUserDto, findOrCreateUserDto);

    const existUser = await this.prismaService.user.findUnique({
      where: { thirdPartUid: findOrCreateUserDto.thirdPartUid },
    });

    if (existUser !== null) return existUser;
    const newUser = await this.prismaService.user.create({ data: findOrCreateUserDto });
    return newUser;
  }
}
