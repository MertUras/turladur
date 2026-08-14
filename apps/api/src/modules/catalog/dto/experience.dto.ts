import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum ExperienceStatusDto {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateExperienceDto {
  @ApiProperty({ example: 'Avanos Çömlek Atölyesi' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Kısa workshop deneyimi' })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: 'Yerel ustalarla 2 saatlik atölye...' })
  @IsString()
  @MinLength(10)
  longDescription!: string;

  @ApiProperty({ example: 'Kültür' })
  @IsString()
  @MaxLength(120)
  category!: string;

  @ApiProperty({ example: 'Avanos' })
  @IsString()
  @MaxLength(200)
  location!: string;

  @ApiProperty({ example: '2 saat' })
  @IsString()
  @MaxLength(80)
  duration!: string;

  @ApiProperty({ example: 890 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 'TRY', default: 'TRY' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageRestriction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingPoint?: string;
}

export class UpdateExperienceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  longDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: ExperienceStatusDto })
  @IsOptional()
  @IsEnum(ExperienceStatusDto)
  status?: ExperienceStatusDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageRestriction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingPoint?: string;
}

export class SearchExperiencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CreateActivityDateDto {
  @ApiProperty({ example: '2026-08-15' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate!: string;

  @ApiProperty({ example: '2026-08-15' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate!: string;

  @ApiProperty({ example: 890 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  availableSeats!: number;
}

export class UpdateActivityDateDto {
  @ApiPropertyOptional({ example: '2026-08-15' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-20' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate?: string;

  @ApiPropertyOptional({ example: 990 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  availableSeats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
