import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpsertCommissionRateDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  @Max(100)
  ratePercent!: number;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  effectiveFrom!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}

export class UpsertAgencyBankInfoDto {
  @ApiProperty({ example: 'TR330006100519786457841326' })
  @IsString()
  @MinLength(15)
  @MaxLength(34)
  iban!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  accountName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  bankName?: string;
}

export class CreatePayoutDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
