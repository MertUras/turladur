import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourCategory } from '@turladur/shared-constants';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTourDto {
  @ApiProperty({ example: 'Kapadokya Balon Turu' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Gün doğumunda balon turu...' })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: 4500 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 'TRY', default: 'TRY' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ enum: TourCategory, example: TourCategory.ADVENTURE })
  @IsEnum(TourCategory)
  category!: TourCategory;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/kapadokya.jpg' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  coverUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryUrls?: string[];

  @ApiPropertyOptional({
    description:
      'Legacy form fields: includes, excludes, healthPrivileges, itinerary, destinations, etc.',
  })
  @IsOptional()
  @IsObject()
  extras?: Record<string, unknown>;
}
