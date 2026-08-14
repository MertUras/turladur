import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterPartnerDto {
  @ApiProperty({ example: 'Kapadokya Turizm A.Ş.' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  companyName!: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxNumber?: string;

  @ApiProperty({ example: 'partner@kapadokya.com' })
  @IsEmail()
  contactEmail!: string;

  @ApiPropertyOptional({ example: '+905551112233' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Atatürk Cad. No:1' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ example: 'Ankara' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({ example: 'Türkiye' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'https://www.ornek.com' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  @ApiProperty({ example: 'Partner123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Şifre en az 1 büyük harf ve 1 rakam içermelidir',
  })
  password!: string;

  @ApiPropertyOptional({ example: 'Ayşe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Kaya' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
