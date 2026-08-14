import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  TourCategory,
  TourDestinationScope,
  TourStayKind,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from '@turta/shared-constants';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchToursDto {
  @ApiPropertyOptional({ example: 'kapadokya' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: TourCategory })
  @IsOptional()
  @IsEnum(TourCategory)
  category?: TourCategory;

  @ApiPropertyOptional({ enum: TourStayKind })
  @IsOptional()
  @IsEnum(TourStayKind)
  stayKind?: TourStayKind;

  @ApiPropertyOptional({ enum: TourDestinationScope })
  @IsOptional()
  @IsEnum(TourDestinationScope)
  destinationScope?: TourDestinationScope;

  @ApiPropertyOptional({ example: 'Ankara' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(80)
  departureCity?: string;

  /** Exact duration in days (legacy `duration=1`). */
  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;

  /**
   * Duration bucket for UI parity: `1` | `2-3` | `4-6` | `7+`
   * Ignored when `durationDays` is set.
   */
  @ApiPropertyOptional({ example: '2-3' })
  @IsOptional()
  @IsString()
  @IsIn(['1', '2-3', '4-6', '7+'])
  duration?: string;

  @ApiPropertyOptional({ description: 'Only featured tours' })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum average rating 1–5' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    enum: ['createdAt', 'price', 'rating', 'durationDays'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'price', 'rating', 'durationDays'])
  sortBy?: 'createdAt' | 'price' | 'rating' | 'durationDays';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

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

  @ApiPropertyOptional({ description: 'Filter by marketplace agency id' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  agencyId?: string;
}
