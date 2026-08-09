import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterGuideDto {
  @ApiProperty({ example: 'Emir' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Şimşek' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: 'rehber@ornek.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Demo1234!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: '10000000146', description: 'TCKN' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'TCKN 11 haneli olmalıdır' })
  identityNumber!: string;

  @ApiProperty({ example: ['tr', 'en'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages!: string[];

  @ApiProperty({ example: 'Ankara', description: 'TUREB oda' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  oda!: string;

  @ApiProperty({ example: 'SIC-12345' })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  sicilNo!: string;

  @ApiProperty({ example: 'RH-98765' })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  ruhsatNo!: string;

  @ApiProperty({ example: '2027-12-31', description: 'Ruhsat geçerlilik' })
  @IsDateString()
  ruhsatExpiresAt!: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: '+90 532 555 0000' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({ example: 'Ankara' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}

export class UpdateGuideProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'TCKN 11 haneli olmalıdır' })
  identityNumber?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  oda?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  sicilNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  ruhsatNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ruhsatExpiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;
}

export class SetGuideStatusDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED', 'SUSPENDED'] })
  @IsString()
  @Matches(/^(VERIFIED|REJECTED|SUSPENDED)$/)
  status!: 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
}
