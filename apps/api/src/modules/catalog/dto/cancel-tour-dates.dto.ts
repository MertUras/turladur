import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourCancelReason } from '@turta/shared-constants';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CancelTourDatesDto {
  @ApiProperty({
    type: [String],
    description: 'TourDate IDs to cancel',
    example: ['clxyz123'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  dateIds!: string[];

  @ApiProperty({
    enum: TourCancelReason,
    example: TourCancelReason.WEATHER,
  })
  @IsEnum(TourCancelReason)
  reason!: TourCancelReason;

  @ApiPropertyOptional({
    description: 'Optional free-text note for internal / email context',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
