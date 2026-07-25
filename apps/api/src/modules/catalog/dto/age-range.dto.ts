import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export enum AgePricingTypeDto {
  FREE = 'FREE',
  HALF = 'HALF',
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateAgeRangeDto {
  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAge!: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiProperty({ enum: AgePricingTypeDto })
  @IsEnum(AgePricingTypeDto)
  pricingType!: AgePricingTypeDto;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value!: number;
}

export class UpdateAgeRangeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxAge?: number | null;

  @ApiPropertyOptional({ enum: AgePricingTypeDto })
  @IsOptional()
  @IsEnum(AgePricingTypeDto)
  pricingType?: AgePricingTypeDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value?: number;
}
