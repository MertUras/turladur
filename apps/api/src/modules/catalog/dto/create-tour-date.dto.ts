import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateTourDateDto {
  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional({ example: 4200 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceOverride?: number;
}
