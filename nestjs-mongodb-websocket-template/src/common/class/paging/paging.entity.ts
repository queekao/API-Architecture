import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmptyObject, Min, ValidateIf, ValidateNested } from 'class-validator';

export class PagingEntity {
  @Expose()
  @ApiProperty({ example: 10, description: '分頁資訊 - 一頁幾筆' })
  @IsInt()
  @Min(1)
  perPage!: number;

  @Expose()
  @ApiProperty({ example: null, description: '分頁資訊 - 上一頁頁數，若無上一頁則為 null' })
  @ValidateIf((entity: PagingEntity, value) => value !== null)
  @IsInt()
  @Min(1)
  previousPage!: number | null;

  @Expose()
  @ApiProperty({ example: 1, description: '分頁資訊 - 當前頁數' })
  @IsInt()
  @Min(1)
  currentPage!: number;

  @Expose()
  @ApiProperty({ example: null, description: '分頁資訊 - 下一頁頁數，若無下一頁則為 null' })
  @ValidateIf((entity: PagingEntity, value) => value !== null)
  @IsInt()
  @Min(1)
  nextPage!: number | null;

  @Expose()
  @ApiProperty({ example: 1, description: '分頁資訊 - 總共有幾頁' })
  @IsInt()
  @Min(1)
  totalPages!: number;

  @Expose()
  @ApiProperty({ example: 1, description: '分頁資訊 - 全部資料筆數' })
  @IsInt()
  totalEntries!: number;
}

export abstract class BasePagingEntity {
  @Expose()
  @ApiProperty({ description: '分頁資訊' })
  @ValidateNested()
  @Type(() => PagingEntity)
  paging!: PagingEntity;

  @Expose()
  @ApiProperty({ description: '資料列表' })
  @IsNotEmptyObject({}, { each: true })
  @IsArray()
  @ValidateNested({ each: true })
  abstract dataList: any[];
}
