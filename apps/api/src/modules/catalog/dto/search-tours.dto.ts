import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  TourCategory,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from '@turladur/shared-constants';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchToursDto {
  @ApiPropertyOptional({ example: 'kapadokya' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: TourCategory })
  @IsOptional()
  @IsEnum(TourCategory)
  category?: TourCategory;

  @ApiPropertyOptional({ default: DEFAULT_PAGE })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({ default: DEFAULT_PAGE_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = DEFAULT_PAGE_LIMIT;
}
