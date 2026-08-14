import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

/**
 * Customer profile update — personal + billing (KVKK: only own data).
 * Email is not updatable here (separate verification flow).
 */
export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ example: '+90 555 123 45 67' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({
    description: 'TC Kimlik No (11 hane)',
    example: '10000000146',
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== '' && v != null)
  @IsString()
  @Matches(/^[1-9][0-9]{10}$/, {
    message: 'TC Kimlik No 11 haneli ve geçerli olmalıdır',
  })
  identityNumber?: string | null;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @ValidateIf((_, v) => v !== '' && v != null)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Doğum tarihi YYYY-MM-DD formatında ve yılı 4 haneli olmalıdır',
  })
  @IsDateString()
  birthDate?: string | null;

  @ApiPropertyOptional({ description: 'Kişisel adres' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  billingLine1?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  billingLine2?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  billingCity?: string | null;

  @ApiPropertyOptional({ description: 'İl / eyalet' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  billingState?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  billingPostalCode?: string | null;

  @ApiPropertyOptional({ example: 'Türkiye' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  billingCountry?: string | null;
}
