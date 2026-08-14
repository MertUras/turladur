import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BusLayoutKind } from '../../../generated/prisma';

export class CreateVehicleDto {
  @ApiProperty({ example: '06 ABC 123' })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  plateNumber!: string;

  @ApiProperty({ enum: BusLayoutKind })
  @IsEnum(BusLayoutKind)
  seatLayoutKind!: BusLayoutKind;

  @ApiPropertyOptional({ example: 2022 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  @Max(2100)
  modelYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: '06 ABC 123' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  plateNumber?: string;

  @ApiPropertyOptional({ enum: BusLayoutKind })
  @IsOptional()
  @IsEnum(BusLayoutKind)
  seatLayoutKind?: BusLayoutKind;

  @ApiPropertyOptional({ example: 2022 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1990)
  @Max(2100)
  modelYear?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
