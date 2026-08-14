import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'YAZ10' })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  code!: string;

  @ApiProperty({ enum: ['PERCENT', 'FIXED'] })
  @IsIn(['PERCENT', 'FIXED'])
  discountType!: 'PERCENT' | 'FIXED';

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  discountValue!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;
}

export class ValidateCouponDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reservationId?: string;
}

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(220)
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
