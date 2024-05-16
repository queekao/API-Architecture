import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { dtoCheckSync } from 'src/common/util/dto-check';
import { PagingEntity } from './paging.entity';

export class PageQueryDto {
  @Expose()
  @ApiProperty({ example: 10, description: '分頁資訊 - 一頁幾筆' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  perPage!: number;

  @Expose()
  @ApiProperty({ example: 1, description: '分頁資訊 - (目前於)第幾頁' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  currentPage!: number;

  toLimit() {
    return this.perPage;
  }

  toOffset() {
    return (this.currentPage - 1) * this.perPage;
  }

  getSlice<T>(array: T[]): T[] {
    return array.slice(this.toOffset(), this.toOffset() + this.toLimit());
  }

  toPagingEntity(count: number): PagingEntity {
    const perPage = this.perPage;
    const currentPage = this.currentPage;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    // 至少一頁
    const totalPages = Math.max(Math.ceil(count / perPage), 1);
    const nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : null;

    return dtoCheckSync(PagingEntity, {
      perPage,
      previousPage,
      currentPage,
      nextPage,
      totalPages,
      totalEntries: count,
    });
  }
}
