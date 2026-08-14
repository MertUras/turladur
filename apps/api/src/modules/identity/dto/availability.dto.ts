import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { BusLayoutKind } from '../../../generated/prisma';

export class AvailabilityRangeQueryDto {
  @ApiProperty({
    example: '2026-08-01',
    description: 'Inclusive start (YYYY-MM-DD)',
  })
  @IsDateString()
  from!: string;

  @ApiProperty({
    example: '2026-08-31',
    description: 'Inclusive end (YYYY-MM-DD)',
  })
  @IsDateString()
  to!: string;
}

/** Agency: list VERIFIED guides + availability for a tour-date range. */
export class ListGuidesForRangeQueryDto extends AvailabilityRangeQueryDto {
  @ApiPropertyOptional({ description: 'Name / email / city search' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    description: 'If true, only guides free for the full from..to range',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  availableOnly?: boolean;
}

/** Agency: list active vehicles (+ company) for a tour-date range. */
export class ListVehiclesForRangeQueryDto extends AvailabilityRangeQueryDto {
  @ApiPropertyOptional({ enum: BusLayoutKind })
  @IsOptional()
  @IsEnum(BusLayoutKind)
  kind?: BusLayoutKind;

  @ApiPropertyOptional({ description: 'Plate / company / city search' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    description: 'If true, only vehicles free for the full from..to range',
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  availableOnly?: boolean;
}

export class SetAvailabilityDayDto {
  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be YYYY-MM-DD',
  })
  date!: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable!: boolean;
}

export class AvailabilityDayDto {
  @ApiProperty({ example: '2026-08-15' })
  date!: string;

  @ApiProperty()
  isAvailable!: boolean;

  @ApiProperty({
    description:
      'True when an ACCEPTED TourDateAssignment covers this day — not toggled by actor',
  })
  locked!: boolean;

  @ApiPropertyOptional({ enum: ['ASSIGNMENT', null] })
  @IsOptional()
  lockReason?: 'ASSIGNMENT' | null;
}
