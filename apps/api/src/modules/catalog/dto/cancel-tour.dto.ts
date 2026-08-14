import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TourCancelReason } from '@turta/shared-constants';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelTourDto {
  @ApiProperty({
    enum: TourCancelReason,
    example: TourCancelReason.WEATHER,
    description: 'Tour cancellation reason selected by partner',
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
