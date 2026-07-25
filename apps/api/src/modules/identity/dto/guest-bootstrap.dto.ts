import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Creates or rejects guest checkout session (new email → JWT; existing → login required). */
export class GuestBootstrapDto {
  @ApiProperty({ example: 'misafir@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Ayşe' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Yılmaz' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: '+905551112233' })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone!: string;

  @ApiProperty({ example: 'Kadıköy, İstanbul' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  address!: string;

  @ApiProperty({ example: 'Bağdat Cad. No:1' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  billingLine1!: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  billingCity!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  billingCountry?: string;

  @ApiProperty({ example: '10000000146' })
  @IsString()
  @Matches(/^[1-9][0-9]{10}$/, {
    message: 'TC kimlik no 11 haneli olmalıdır',
  })
  identityNumber!: string;
}
